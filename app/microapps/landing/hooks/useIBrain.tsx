'use client';
import { useCommunicationManager } from '@/app/hooks/useCommunicationManager';
import { useBrainStack } from '@/app/providers/brainstack';
import OpenAi from 'openai';
import {
  ChatCompletionMessageParam,
  ChatCompletionTool
} from 'openai/resources';

const d = new OpenAi({
  baseURL: process.env.NEXT_PUBLIC_BASEURL,
  apiKey: process.env.NEXT_PUBLIC_TOGETHER,
  dangerouslyAllowBrowser: true
});

const model = process.env.NEXT_PUBLIC_MODEL;

export default function useIBrain() {
  const bstack = useBrainStack();
  const { getHistory } = useCommunicationManager({});
  const promptBuilderMock = (action: string, message: string) =>
    `Prompt Test: action: ${action} message: ${message} history: ` +
    getHistory(5);

  const createTool = (
    name: string,
    description: string,
    required: string[],
    properties: Record<string, any>
  ): ChatCompletionTool => {
    return {
      type: 'function',
      function: {
        name,
        description,
        parameters: {
          type: 'object',
          properties,
          required
        }
      }
    };
  };

  const weatherTool = createTool(
    'getWeatherFromCity',
    'Useful to retreive weather for the specific city. Argument is the city name asked or unknown.',
    [],
    {
      city: {
        type: 'string',
        description: 'The city to get weather.'
      }
    }
  );

  const messages: Array<ChatCompletionMessageParam> = [];

  const processMessage = async (text: string) => {
    messages.push({ role: 'user', content: text });
    const answer = await d.chat.completions.create({
      //@ts-ignore
      model,
      messages,
      tool_choice: 'auto',
      tools: [weatherTool]
    });

    console.log(answer);
    //answer.choices[0].message.tool_calls[0].function.arguments
    if (!answer?.choices?.[0]?.message?.tool_calls) {
      console.log('No tools call: ', answer?.choices?.[0]?.message.content);
    }

    if (answer?.choices?.[0]?.message?.tool_calls?.[0]?.id) {
      const a = JSON.parse(
        answer.choices[0].message.tool_calls[0].function.arguments
      );

      let content = 'Specify the city you want to have the weather?';

      if (a?.city) {
        // find weather for city
        content = 'It is 34 celcius';
      }

      messages.push(answer.choices[0].message);
      messages.push({
        role: 'tool',
        tool_call_id: answer.choices[0].message.tool_calls[0].id,
        content
      });

      const toolanswer = await d.chat.completions.create({
        //@ts-ignore
        model,
        messages
        // tool_choice: 'auto',
        // tools: [weatherTool]
      });

      console.log(toolanswer);
    }
  };

  bstack.useOn(
    'communication.user',
    (e: any) => {
      //   const prompt = promptBuilderMock('hear', e.text);
      // bstack.log.info(prompt) // + tools
      //   createAiTask(prompt, [pricingTool(), navigationTool()]);
      processMessage(e.text);
    },
    [processMessage]
  );
}
