import { core } from '@/app/providers/brainstack';

export const generatePrompt = (message: string, history: string) => {
  const lang = core.store.getState()?.language ?? 'en-CA';

  return `Your task is to respond to the user's message below in language ${lang}.
  
Your response must follow these guidelines:
---
1. Consider human societal norms of natural discussion
2. Avoiding useless repitions, out of the scope topics and greetings when already discussing
3. Keep your answer short and straight to the point as human has limited attention capacity
4. Ask one question at a time and wait for answer
---


Please consider the discussion history provided for context:
---

${history}

---

User's Message:
${message}
`;
};

export const generatePromptSummaryBrainstorm = (summary: string, history: string) => {
  const lang = core.store.getState()?.language ?? 'en-CA';

  return `Your task is to generate a structured and detailed markdown document based on the following informations in language ${lang}.
  
Please consider the discussion history provided for context:
---

${history}

---

Summary:
${summary}
`;
};
