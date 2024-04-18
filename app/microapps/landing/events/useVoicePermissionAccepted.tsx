'use client';
import { useBrainStack } from '@/app/providers/brainstack';
import { EventNames } from '@/app/providers/types';
import { ai } from '../integration/aiIntegration';
import { useEffect, useState } from 'react';

export default function useVoicePermissionAccepted() {
  const bstack = useBrainStack();
  const [welcome, setWelcome] = useState('');

  const earlyGenerateWelcomeMessage = async () => {
    try {
      const welcomeMsg = await ai.askQuick(
        'You are iBrain One, an Ai Website Assistant helping user on our website. Since our website require microphone and audio to discuss, A permission was requested initialy. The user just came on our website and did accept the audio permission request. You will respond with a friendly welcome message to the user telling that you are iBrain One and you are here to help to explain services, prices, subscribe, signin or anything related. Keep message short and make sure at the end, you suggest options to user on whats next to guide. For example: Would you like me to explain features or pricing?'
      );

      setWelcome(welcomeMsg ?? '');
    } catch (error) {}
  };

  useEffect(() => {
    earlyGenerateWelcomeMessage()
  }, []);

  bstack.useOn(
    EventNames.VoicePermissionAccepted,
    (e: any) => {
      ai.talkStraight(welcome)
    },
    [welcome]
  );
}
