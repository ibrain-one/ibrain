'use client';
import { useEffect, useRef } from 'react';
import { useBrainStack } from '../providers/brainstack';
import { useTaskManager } from '../providers/taskManager';

export const useTextToSpeech = () => {
  const bstack = useBrainStack();
  const synthesisRef = useRef<SpeechSynthesis>();
  const { addSyncTask } = useTaskManager();

  useEffect(() => {
    synthesisRef.current = window.speechSynthesis;
    return () => {
      synthesisRef.current?.cancel();
    };
  }, []);

  const speakText = (utterance: SpeechSynthesisUtterance) => {
    // Configure utterance properties as neede
    if (!synthesisRef.current) return;
    bstack.store.mutate((s) => ({ ...s, isSpeaking: true }));
    synthesisRef.current.speak(utterance);
    bstack.store.emit('speech.speaking');
  };

  const aiSpeak = (text: string) => {
    bstack.store.emit('speech.speaking');
    const sentences = text
      .split(/(?<=[.!?])/)
      .filter((sentence) => sentence.trim());

    sentences.forEach((sentence, index) => {
      bstack.log.verbose(`SENTENCE: `, sentence);

      let trimmedSentence = sentence.trim();
      const action = extractAction(trimmedSentence);
      if (action) {
        addSyncTask('Speech Action', async () => {
          bstack.store.emit(`speech.action`, { action });
        });
        trimmedSentence = extractTextAfterAction(trimmedSentence);
      }

      if (trimmedSentence) {
        const utterance = new SpeechSynthesisUtterance(trimmedSentence);

        // Set language based on state
        utterance.lang = bstack.store.getState()?.language || 'en-CA';

        // Set voice based on language
        const voices = synthesisRef?.current?.getVoices();
        if (voices) {
          let voiceForLanguage = voices.find(
            (voice) =>
              voice.lang === utterance.lang &&
              voice.name.toLowerCase().includes('natural')
          );

          if (!voiceForLanguage) {
            voiceForLanguage = voices.find(
              (voice) => voice.lang === utterance.lang
            );
          }
          if (voiceForLanguage) {
            utterance.voice = voiceForLanguage;
          }
        }

        const speakTask = (signal: AbortSignal) =>
          new Promise<void>((resolve, reject) => {
            // Check if the task is already aborted at the start
            if (signal.aborted) {
              bstack.store.mutate((s) => ({ ...s, isSpeaking: false }));
              bstack.store.emit('speech.silent');
              reject(
                new DOMException('The speech task was aborted', 'AbortError')
              );
              return;
            }

            utterance.onstart = () => {
              bstack.store.emit('speech.speaking');
            };

            utterance.onend = () => {
              if (index >= sentences.length - 1) {
                bstack.store.mutate((s) => ({ ...s, isSpeaking: false }));
                bstack.store.emit('speech.silent');
              }
              resolve();
            };

            // Handle the abort signal
            signal.addEventListener('abort', () => {
              // Perform any cleanup or state updates needed when the task is aborted
              bstack.store.mutate((s) => ({ ...s, isSpeaking: false }));
              bstack.store.emit('speech.silent');
              window.speechSynthesis.cancel(); // This cancels the current speech synthesis

              reject(
                new DOMException('The speech task was aborted', 'AbortError')
              );
            });

            speakText(utterance);
          });

        addSyncTask('iBrain Talk', speakTask);
      }
    });
  };

  useEffect(() => {
    const unsubscribe = bstack.store.on('communication.ai', (e: any) => {
      aiSpeak(e.text);
    });

    return () => {
      unsubscribe();
    };
  }, []);
};

function extractAction(text: string): string | null {
  // Regular expression to find ##Action:SectionIdentifier##
  const sectionRegex = /##Action:(\w+)##/;
  const match = text.match(sectionRegex);

  return match ? match[1] : null; // Return the section identifier or null if no match
}

function extractTextAfterAction(text: string): string {
  // Regular expression to find and split the text at ##Action:SectionIdentifier##
  const splitRegex = /##Action:\w+##/;
  const parts = text.split(splitRegex);

  return parts.length > 1 ? parts[1].trim() : ''; // Return the text after the hashtag, trimmed of whitespace
}
