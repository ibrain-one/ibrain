import { PropsWithChildren, Suspense } from 'react';
import { IBrain } from './components/IBrain/IBrain';
import { createClient } from '@/utils/supabase/server';
import { redirect } from 'next/navigation';

export default async function MicroAppLayout({ children }: PropsWithChildren) {
  const supabase = createClient();

  const {
    data: { user },
    error
  } = await supabase.auth.getUser();

  if (error) {
    console.log(error);
  }

  if (!user) {
    redirect('/signin');
  }
  return (
    <Suspense>
      <IBrain/>
      <section>{children}</section>
    </Suspense>
  );
}
