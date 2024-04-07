import { HomeComponent } from '@/components/ui/Home';
import Pricing from '@/components/ui/Pricing/Pricing';
import Subscriptions from '@/components/ui/Subscriptions/Subscriptions';
import { createClient } from '@/utils/supabase/server';
import { redirect } from 'next/navigation';

export default async function LandingMicroAppPage() {
  const supabase = createClient();

  const {
    data: { user }
  } = await supabase.auth.getUser();

  const { data: subscription, error } = await supabase
    .from('subscriptions')
    .select('*, prices(*, products(*))')
    .in('status', ['trialing', 'active'])
    .maybeSingle();

  if (error) {
    console.log(error);
  }

  const { data: products } = await supabase
    .from('products')
    .select('*, prices(*)')
    .eq('active', true)
    .eq('prices.active', true)
    .order('metadata->index')
    .order('unit_amount', { referencedTable: 'prices' });

  if (user) {
    redirect('/protected/user');
  }

  return (
    <>
      <HomeComponent />
      <Subscriptions />
      {/* <Pricing
        user={user}
        products={products ?? []}
        subscription={subscription}
      /> */}
    </>
  );
}
