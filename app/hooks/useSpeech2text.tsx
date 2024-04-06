'use client';
import { Suspense, useEffect, useMemo, useState } from 'react';
import { useBrainStack } from '../providers/brainstack';
import { VoicePermissionAlert } from '@/components/ui/VoicePermissionAlert';

const SpeechRecognition =
  (global?.window as any)?.SpeechRecognition ||
  (global?.window as any)?.webkitSpeechRecognition;

export const useSpeech2text = () => {
  const bstack = useBrainStack();

  const startListening = () => {
    try {
      const recognition = bstack.store.getState()?.recognition;
      const isRecognizing = bstack.store.getState()?.isRecognizing;

      recognition?.start();
      bstack.log.verbose('Started listening...');
    } catch (e) {}
  };

  const stopListening = () => {
    const recognition = bstack.store.getState((s) => s?.recognition);
    const isRecognizing = bstack.store.getState((s) => s?.isRecognizing);

    if (isRecognizing) {
      recognition?.abort();
      bstack.log.verbose('Stopped listening...');
    }
  };

  bstack.useOn('speech.speaking', stopListening, []);
  bstack.useOn('speech.silent', startListening, []);

  // const changeLanguage = (newLanguage: string) => {
  //   bstack.store.mutate((s) => ({ ...s, language: newLanguage }));
  //   bstack.log.verbose(`Language changed to ${newLanguage}`);
  // };

  useEffect(() => {
    if (!SpeechRecognition) {
      bstack.log.error('Speech Recognition is not supported by this browser.');
      return;
    }

    const recognitionInstance = new SpeechRecognition();
    recognitionInstance.continuous = true;
    recognitionInstance.lang =
      bstack.store.getState((s) => s?.language) ?? 'en-US';

    recognitionInstance.onstart = () => {
      bstack.store.mutate((s) => ({ ...s, isRecognizing: true }));
      bstack.log.verbose('Recognition started...');
    };

    recognitionInstance.onend = () => {
      bstack.log.verbose(
        'executing recognitionInstance.onend = () => {} window.speechSynthesis.speaking value is ',
        window.speechSynthesis.speaking
      );

      if (window.speechSynthesis.speaking) {
        bstack.store.mutate((s) => ({ ...s, isRecognizing: false }));
        bstack.log.verbose('Recognition ended...');
      }

      if (!window.speechSynthesis.speaking) {
        bstack.log.verbose('Recognition restarting...');
        startListening();
      }
    };

    recognitionInstance.onresult = (event: any) => {
      const transcript =
        event.results?.[event.results?.length - 1]?.[0]?.transcript;
      bstack.store.emit('speech2text.result', { text: transcript });
      bstack.log.verbose('Speech recognition result received: ', event);
    };

    recognitionInstance.onerror = (event: any) => {
      if (
        !event?.error?.includes('no-speech') &&
        !event?.error?.includes('aborted')
      ) {
        bstack.log.error('Speech recognition error', event);
      }
    };

    bstack.store.mutate((s) => ({ ...s, recognition: recognitionInstance }));

    return () => {
      stopListening();
    };
  }, [bstack.store.getState()?.language]);

  const [micPermissionGranted, setMicPermissionGranted] = useState(false);
  const [showVoiceAlert, setShowVoiceAlert] = useState(true);

  useEffect(() => {
    if (micPermissionGranted) {
      startListening();
      return () => stopListening();
    }
  }, [micPermissionGranted]);

  useEffect(() => {
    if (window && window?.localStorage?.getItem('micPermissionGranted')) {
      setShowVoiceAlert(false);
      setMicPermissionGranted(true);
    }
  }, []);

  const requestMicPermission = async () => {
    try {
      await navigator.mediaDevices.getUserMedia({ audio: true });
      setMicPermissionGranted(true);
      setShowVoiceAlert(false);
      bstack.log.info('Mic permission granted');
      window?.localStorage.setItem('micPermissionGranted', 'true'); // Set the flag in localStorage
    } catch (error) {
      bstack.log.error('Microphone access denied.', error);
      setMicPermissionGranted(false);
    }
  };

  // Function to handle closing the VoicePermissionAlert
  const handleCloseAlert = () => {
    setShowVoiceAlert(false); // Hide the alert
  };

  const VoicePermissionRequest = () => (
    <>
      {showVoiceAlert && (
        <Suspense>
          <VoicePermissionAlert
            requestMicPermission={requestMicPermission}
            onClose={handleCloseAlert}
          />
        </Suspense>
      )}
    </>
  );

  return {
    // isRecognizing: bstack.store.getState()?.isRecognizing ?? false,
    // startListening,
    // stopListening,
    VoicePermissionRequest
  };
};
