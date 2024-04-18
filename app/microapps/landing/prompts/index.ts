import { core } from '@/app/providers/brainstack';

export const generatePrompt = (message: string) => {
  const lang = core.store.getState()?.language ?? 'en-CA';
  const arrayHistory = core.store.getState()?.history ?? [];
  const history =
    arrayHistory?.length <= 0
      ? 'It is the first message'
      : JSON.stringify(arrayHistory?.slice?.(-5));

  return `You are iBrain One an AI assistant. You will respond the user message concerning your features, pricing and anything related to it. If discussion fall out of scope, politely bring back the topic accoridngly. Considering the following instructions:
The discussion history:
${history}

You will answer in the following language: 
${lang}

User message:
${message}
`;
};
