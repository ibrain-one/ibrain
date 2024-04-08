import { HomeComponent } from '@/components/ui/Home';
import Subscriptions from '@/components/ui/Subscriptions/Subscriptions';
import { createClient } from '@/utils/supabase/server';
import { redirect } from 'next/navigation';

export default async function LandingMicroAppPage() {
  const supabase = createClient();

  const {
    data: { user },
    error
  } = await supabase.auth.getUser();

  if (error) {
    console.log(error);
  }

  if (user) {
    redirect('/protected/user');
  }

  return (
    <>
      <HomeComponent />
      <Subscriptions />
    </>
  );
}
