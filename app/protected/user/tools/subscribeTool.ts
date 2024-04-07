import { core } from '@/app/providers/brainstack';
import { createTool } from './createTool';

export interface SubscriptionArguments {
  method: 'email' | 'google' | 'github';
}

export const subscribeTool = createTool(
  'subscribe',
  'Subscribe using an Email, Google account, or GitHub account. For example: Lets subscribe by email or google. ',
  [], // Required parameters
  {
    method: {
      type: 'string',
      description: 'The method to use for subscription (email, Google, GitHub).'
    }
  },
  async (args: SubscriptionArguments) => {
    if (!args || !args.method) {
      return 'Please specify a subscription method: email, Google, or GitHub.';
    }

    console.log(`Subscribing using ${args.method}...`);

    switch (args.method.toLowerCase()) {
      case 'email':
        core.store.emit('tool.signin', { provider: 'email' });
        return `Instruct the user to insert an email and password to subscribe. After submitting their information, ensure the user understands they will receive a confirmation email and its done!`;

      case 'google':
        core.store.emit('tool.signin', { provider: 'google' });
        return 'Confirm to the user that their subscription via Google account is successful. Provide them with information on how to start using the service or ask you for help if needed.';
      case 'github':
        core.store.emit('tool.signin', { provider: 'github' });
        return 'Welcome the user to the service, acknowledging their subscription through GitHub. Provide them with information on how to start using the service or ask you for help if needed.';
      default:
        return 'Inform the user that the subscription method they attempted is not recognized. Request them to choose among the available methods: email, Google, or GitHub, and try again.';
    }
  }
);
