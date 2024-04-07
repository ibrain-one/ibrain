'use client';
import { useEffect, useRef } from 'react';
import { useBrainStack } from '../providers/brainstack';

export const useTextToSpeech = () => {
  const bstack = useBrainStack();
  const synthesisRef = useRef<SpeechSynthesis>();

  useEffect(() => {
    synthesisRef.current = window.speechSynthesis;
    return () => {
      synthesisRef.current?.cancel();
    };
  }, []);

  const speakText = (utterance: SpeechSynthesisUtterance) => {
    if (!synthesisRef.current) return;

    // Configure utterance properties as needed
    bstack.store.mutate((s) => ({ ...s, isSpeaking: true }));
    synthesisRef.current.speak(utterance);
  };

  const aiSpeak = (text: string) => {
    bstack.store.emit('speech.speaking');
    const sentences = text
      .split(/(?<=[.!?])/)
      .filter((sentence) => sentence.trim());

    sentences.forEach((sentence, index) => {

      const trimmedSentence = sentence.trim();
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

        utterance.onend = () => {
          if (index >= sentences.length - 1) {
            bstack.store.mutate((s) => ({ ...s, isSpeaking: false }));
            bstack.store.emit('speech.silent');
          }
          // resolve();
        };

        speakText(utterance);
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
