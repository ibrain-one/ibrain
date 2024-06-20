'use client';
import { useBrainStack } from '@/app/providers/brainstack';
import { EventNames } from '@/app/providers/types';
import { useRouter } from 'next/navigation';

export default function useSpeechAction() {
  const bstack = useBrainStack();
  const { push } = useRouter();

  bstack.useOn(
    EventNames.SpeechAction,
    (e: { action: string }) => {
      if (e?.action) {
        push(`#${e.action}`);
      }
    },
    []
  );
}
