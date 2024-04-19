import { HomeComponent } from '@/components/ui/Home';
// import QnAComponent from '@/components/ui/QnAComponent/QnAComponent';
import Subscriptions from '@/components/ui/Subscriptions/Subscriptions';
// import { pipeline, env } from '@xenova/transformers';
// env.allowLocalModels = false;
// env.useFS = false;

export default async function LandingMicroAppPage() {
  // const loadedModel = await pipeline('text-generation', 'Xenova/gpt2');

  return (
    <>
      <HomeComponent />
      <Subscriptions />
      {/* <QnAComponent model={loadedModel}/> */}
    </>
  );
}
