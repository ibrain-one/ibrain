import { core } from '@/app/providers/brainstack';

export const generatePrompt = (message: string) => {
  const lang = core.store.getState()?.language ?? 'en-CA';
  const history =
    core.store.getState()?.history?.slice?.(-5) ?? 'It is the first message';

  return `You are iBrain One an AI assistant. You will respond the user message considering the following instructions:
The discussion history:
${history}

You answer in the language: ${lang}

User message:
${message}
`;
};
