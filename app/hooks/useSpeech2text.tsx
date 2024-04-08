'use client';
import { Suspense, useEffect, useMemo, useRef, useState } from 'react';
import { useBrainStack } from '../providers/brainstack';
import { VoicePermissionAlert } from '@/components/ui/VoicePermissionAlert';
import { EventNames } from '../providers/types';

const SpeechRecognition =
  (global?.window as any)?.SpeechRecognition ||
  (global?.window as any)?.webkitSpeechRecognition;

export const useSpeech2text = () => {
  const bstack = useBrainStack();
  const recognitionRef = useRef<any>(null); 

  const startListening = () => {
    try {
      if (recognitionRef.current) {
        recognitionRef.current.lang = bstack.store.getState((s) => s?.language) ?? 'en-US';
        recognitionRef.current.start();
        bstack.log.verbose('Started listening...');
      }
    } catch (e) {
      bstack.log.error('Error starting speech recognition:', e);
    }
  };

  const stopListening = () => {
    if (bstack.store.getState()?.isRecognizing) {

      recognitionRef.current?.abort();
      bstack.log.verbose('Stopped listening...');
    }
  };

  useEffect(() => {
    if (!('SpeechRecognition' in window || 'webkitSpeechRecognition' in window)) {
      bstack.log.error('Speech Recognition is not supported by this browser.');
      return;
    }

    recognitionRef.current = new SpeechRecognition();
    recognitionRef.current.continuous = true;
    recognitionRef.current.lang = bstack.store.getState((s) => s?.language) ?? 'en-US';

    recognitionRef.current.onstart = () => {
      bstack.store.mutate((s) => ({ ...s, isRecognizing: true }));
      bstack.log.verbose('Recognition started...');
    };

    recognitionRef.current.onend = () => {
      bstack.log.verbose('Recognition ended...');
      if (!window.speechSynthesis.speaking) {
        bstack.store.mutate((s) => ({ ...s, isRecognizing: false }));
        bstack.log.verbose('Recognition restarting...');
        startListening();
      }
    };

    recognitionRef.current.onresult = (event:any) => {
      const transcript = event.results[event.results.length - 1][0].transcript;
      bstack.store.emit('speech2text.result', { text: transcript });
      bstack.log.verbose('Speech recognition result received: ', event);
    };

    recognitionRef.current.onerror = (event:any) => {
      bstack.log.error('Speech recognition error', event.error);
    };

    // Cleanup function to abort ongoing recognition when the component unmounts or re-renders
    return () => {
      recognitionRef.current?.abort();
    };
  }, []); // Removed dependency on bstack.store.getState().language to avoid re-initializing the recognition instance on language changes. Consider handling language changes differently if needed.

  bstack.useOn('speech.speaking', stopListening, []);
  bstack.useOn('speech.silent', startListening, []);

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
      window?.localStorage.setItem('micPermissionGranted', 'true');
      bstack.store.emit(EventNames.VoicePermissionAccepted)
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
    VoicePermissionRequest
  };
};
