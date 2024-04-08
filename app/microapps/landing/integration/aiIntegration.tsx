'use client';
import OpenAi from 'openai';
import { tools } from '../tools';
import { ChatCompletionMessageParam } from 'openai/resources';
import { core } from '@/app/providers/brainstack';
import { EventNames } from '@/app/providers/types';

const aiIntegration = new OpenAi({
  baseURL: process.env.NEXT_PUBLIC_BASEURL,
  apiKey: process.env.NEXT_PUBLIC_TOGETHER,
  dangerouslyAllowBrowser: true
});
const model: any = process.env.NEXT_PUBLIC_MODEL;

const askWithTools = (messages: Array<ChatCompletionMessageParam>) =>
  aiIntegration.chat.completions.create({
    model,
    messages,
    tool_choice: 'auto',
    tools: Object.keys(tools).map((key) => tools[key].definition)
  });

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

const talk = async (thoughts: string) => {
  const answer = await askQuick(thoughts);
  core.store.emit(EventNames.IBrainSpeak, { text: answer });
};

export const ai = {
  ask,
  askWithTools,
  askQuick,
  talk,
  client: aiIntegration
};
