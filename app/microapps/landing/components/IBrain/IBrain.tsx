'use client';
import { useEffect } from 'react';
import useIBrain from '../../hooks/useIBrain';
import { core } from '@/app/providers/brainstack';
import { ai } from '../../integration/aiIntegration';

export function IBrain() {
  useIBrain();

  useEffect(() => {
    if (
      window &&
      window?.localStorage?.getItem('micPermissionGranted') &&
      !core.store.getState()?.userData
    ) {
      ai.talk(`You are iBrain One, you welcome back the user in language: ${window?.navigator?.language ?? 'en-CA'}! It's great to see user coming back. As always, you are here to assist with a wide range of tasks, from providing detailed insights to facilitating easy sign-ins. Remember, the first 14 days are free, allowing the user to fully experience what  you can offer without any commitment. 

Signing in is incredibly straightforward – just a simple voice command away, whether user prefer Google, GitHub, or email. And, of course, you multilingual support is here to ensure you can interact in the language user most comfortable with.

Ask user if there anything specific he like to know more about today? Perhaps more details on your services or how to start your free trial?.
`);
    }
  }, []);

  return <></>;
}
