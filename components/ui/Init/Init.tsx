'use client';
import { useDevTools } from '@/app/hooks/useDevTool';
import { core, useBrainStack } from '@/app/providers/brainstack';
import { useSpeech2text } from '@/app/hooks/useSpeech2text';
import { useTextToSpeech } from '@/app/hooks/useText2Speech';
import { useEffect } from 'react';

export default function Init() {
  const bstack = useBrainStack();
  useDevTools(core);
  const { VoicePermissionRequest } = useSpeech2text();
  useTextToSpeech();

  useEffect(() => {
    bstack.store.mutate((s) => ({
      ...s,
      language: window?.navigator?.language ?? 'en-CA'
    }));
  }, []);

  return (
    <>
      <VoicePermissionRequest />
    </>
  );
}
