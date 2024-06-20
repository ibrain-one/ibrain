import { createTool } from '../../../../factories/createTool';
import { ai } from '../integration/aiIntegration';
import { core } from '../../../providers/brainstack';
import { generatePromptSummaryBrainstorm } from '../prompts';
import { ChatCompletionMessageParam } from 'openai/resources';
export interface SummarizeBrainstormArguments {
  summary: string;
}

export const summarizeBrainstormTool = createTool(
  'summarizeBrainstorm',
  'Useful to summarize the brainstorm and generate structured document in markdown format.',
  ['summary'],
  {
    summary: {
      type: 'string',
      description: 'The current brainstorm summary.'
    }
  },
  async (args: SummarizeBrainstormArguments) => {
    if (!args || !args.summary) {
      return 'You will need to provide the brainstorm summary.';
    }

    const messages: Array<ChatCompletionMessageParam> = [
      { role: 'system', content: `You are iBrain One an AI assistant.` }
    ];

    messages.push({
      role: 'user',
      content: generatePromptSummaryBrainstorm(args.summary, '')
    });

    const answer = await ai.ask(messages);
    core.store.emit('content.markdown', {
      content: answer.choices?.[0].message.content
    });

    return `You will respond that the brainstorm summary is now in the text editor.`;
  }
);
