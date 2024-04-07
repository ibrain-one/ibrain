import { core } from '@/app/providers/brainstack';
import { createTool } from './createTool';

export interface LanguageChangeArguments {
  language: string;
  recognitionLanguageCode: string;
  synthesisLanguageCode: string;
}

export const changeConversationLanguageTool = createTool(
  'changeConversationLanguage',
  "Useful to change the spoken conversation language with the user. Example of user could tell: Hey, let's talk in French now.",
  ['language', 'recognitionLanguageCode', 'synthesisLanguageCode'],
  {
    language: {
      type: 'string',
      description: 'The language to switch to.'
    },
    recognitionLanguageCode: {
      type: 'string',
      description: 'The language code for web speech recognition.'
    },
    synthesisLanguageCode: {
      type: 'string',
      description: 'The language code for web speech synthesis.'
    }
  },
  async (args: LanguageChangeArguments) => {
    if (
      !args ||
      !args.language ||
      !args.recognitionLanguageCode ||
      !args.synthesisLanguageCode
    ) {
      return 'You will need to ask user to what language he wants to discuss.';
    }

    core.store.mutate((s) => ({
      ...s,
      language: args.recognitionLanguageCode
    }));

    return `You will respond back in ${args.language} to let the user know language is changed now.`;
  }
);
