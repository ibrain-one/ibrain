// hooks/useOAuthSignIn.js or useOAuthSignIn.ts if using TypeScript

import { useState } from 'react';
import { signInWithOAuthImperative } from '@/utils/auth-helpers/client';
import { Provider } from '@supabase/supabase-js';

const useOAuthSignIn = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSignIn = async (providerName: Provider) => {
    setIsSubmitting(true);
    try {
      await signInWithOAuthImperative(providerName);
    } catch (error) {
      console.error("Error signing in with provider:", providerName, error);
      // Optionally handle the error, e.g., show a notification
    } finally {
      setIsSubmitting(false);
    }
  };

  return { isSubmitting, handleSignIn };
};

export default useOAuthSignIn;
