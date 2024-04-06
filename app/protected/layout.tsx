import { PropsWithChildren, Suspense } from 'react';
import { redirect } from 'next/navigation'
import { createClient } from '@/utils/supabase/server'

export default async function ProtectedLayout({ children }: PropsWithChildren) {
  const supabase = createClient()

  const { data, error } = await supabase.auth.getUser()
  if (error || !data?.user) {
    redirect('/signin/password_signin')
  }
  return (
    <Suspense>
      <section>{children}</section>
    </Suspense>
  );
}
