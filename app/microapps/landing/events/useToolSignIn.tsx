'use client';
import { useBrainStack } from '@/app/providers/brainstack';
import useOAuthSignIn from '@/app/hooks/useOAuthSignIn';
import { useRouter } from 'next/navigation';

export default function useToolSignIn() {
  const bstack = useBrainStack();
  const { push } = useRouter();
  const { handleSignIn } = useOAuthSignIn();

  bstack.useOn(
    'tool.signin',
    (e: any) => {
      if (!e?.provider || String(e?.provider).toLowerCase().includes('email')) {
        push(`/signin`);
      } else {
        handleSignIn(e.provider);
      }
    },
    []
  );
}
