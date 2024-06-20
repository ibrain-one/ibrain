import { config } from 'dotenv';
import OpenAi from 'openai';
import { ChatCompletionMessageParam } from 'openai/resources';
config();

const aiIntegration = new OpenAi({
  baseURL: process.env.NEXT_PUBLIC_BASEURL,
  apiKey: process.env.NEXT_PUBLIC_TOGETHER,
  dangerouslyAllowBrowser: true
});
const model: any = process.env.NEXT_PUBLIC_MODEL;

// const askWithTools = (messages: Array<ChatCompletionMessageParam>) =>
//   aiIntegration.chat.completions.create({
//     model,
//     messages,
//     tool_choice: 'auto',
//     tools: Object.keys(tools).map((key) => tools[key].definition),
//     temperature:0.8
//   });

const ask = (messages: Array<ChatCompletionMessageParam>) =>
  aiIntegration.chat.completions.create({
    model,
    messages
  });

const askQuick = async (message: string) => {
  const answer = await aiIntegration.chat.completions.create({
    model,
    messages: [{ role: 'user', content: message }]
  });

  return answer.choices[0].message.content;
};

export const ai = {
  ask,
  // askWithTools,
  askQuick,
  client: aiIntegration
};
