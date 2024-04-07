import { createTool } from './createTool';

export interface SubscriptionArguments {
  method: 'email' | 'google' | 'github';
}

export const subscribeTool = createTool(
  'subscribe',
  'Subscribe using an email, Google account, or GitHub account. For example: Lets subscribe by email or google. ',
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
        return 'Instruct the user to check their email inbox for a confirmation message. Ensure the user understands they need to click the confirmation link to complete the subscription process.';
      case 'google':
        return 'Confirm to the user that their subscription via Google account is successful. Advise them on the next steps, if any, or what content they can now access.';
      case 'github':
        return 'Welcome the user to the service, acknowledging their subscription through GitHub. Provide them with information on how to start using the service or where to find help if needed.';
      default:
        return 'Inform the user that the subscription method they attempted is not recognized. Request them to choose among the available methods: email, Google, or GitHub, and try again.';
    }
  }
);
