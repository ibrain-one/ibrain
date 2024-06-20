'use client';
import { useBrainStack } from '@/app/providers/brainstack';
import { EventNames } from '@/app/providers/types';
import { ai } from '../integration/aiIntegration';

export default function useVoicePermissionAccepted() {
  const bstack = useBrainStack();

  bstack.useOn(
    EventNames.VoicePermissionAccepted,
    (e: any) => {
      ai.talk(
        'You are iBrain One, an Ai assistant helping user on your website. Since its your website require microphone and audio to discuss. A permission is requested initialy. The user just came on the website and did accepted the permission request. You will respond with a friendly welcome message to the user telling that you are iBrain one and you are here to help the user.'
      );
    },
    []
  );
}
