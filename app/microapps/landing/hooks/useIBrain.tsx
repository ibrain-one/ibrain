'use client';
import { useCommunicationManager } from '@/app/hooks/useCommunicationManager';
import { useBrainStack } from '@/app/providers/brainstack';
import OpenAi from 'openai';
import { ChatCompletionMessageParam } from 'openai/resources';
import { useEffect } from 'react';
import { pricingTool } from '../tools/pricingTool';
import { changeConversationLanguageTool } from '../tools/languageTool';
import { subscribeTool } from '../tools/subscribeTool';
import { navigateToFeatureTool } from '../tools/navigationTool';

const d = new OpenAi({
  baseURL: process.env.NEXT_PUBLIC_BASEURL,
  apiKey: process.env.NEXT_PUBLIC_TOGETHER,
  dangerouslyAllowBrowser: true
});

const model: any = process.env.NEXT_PUBLIC_MODEL;

const tools: any = {
  explainpricing: pricingTool,
  changeconversationlanguage: changeConversationLanguageTool,
  subscribe: subscribeTool,
  navigateto: navigateToFeatureTool
};

// Tool lookup function
const getToolByName = (name: any) => {
  return tools[name];
};

export default function useIBrain() {
  const bstack = useBrainStack();
  // DONT USE useCommunciationManager() twice
  const { getHistory } = useCommunicationManager({});
  const promptBuilderMock = (action: string, message: string) =>
    `Prompt Test: action: ${action} message: ${message} history: ` +
    getHistory(5);

  const messages: Array<ChatCompletionMessageParam> = [];

  const executeToolCall = async (toolCall: any) => {
    const tool = getToolByName(String(toolCall.function.name).toLowerCase());
    if (!tool) {
      console.error(
        `No tool found with name: ${String(toolCall.function.name).toLowerCase()}`
      );
      return null;
    }

    try {
      const args = JSON.parse(toolCall.function.arguments);
      const content = await tool.execute(args);
      return {
        content,
        tool_call_id: toolCall.id
      };
    } catch (error) {
      console.error(`Error executing tool ${toolCall.function.name}:`, error);
      return null;
    }
  };

  const processMessage = async (text: string) => {
    messages.push({ role: 'user', content: text });

    const answer = await d.chat.completions.create({
      model,
      messages,
      tool_choice: 'auto',
      tools: Object.keys(tools).map((key) => tools[key].definition)
    });

    console.log(answer);

    if (!answer?.choices?.[0]?.message?.tool_calls) {
      console.log('No tool calls:', answer?.choices?.[0]?.message.content);
      bstack.store.emit('communication.ai', {
        text: answer?.choices?.[0]?.message.content
      });
    } else {
      messages.push(answer.choices[0].message);

      const toolCallsPromises =
        answer.choices[0].message.tool_calls.map(executeToolCall);
      const toolResponses = await Promise.all(toolCallsPromises);

      const validResponses = toolResponses.filter(
        (response) => response !== null
      );

      validResponses.forEach((args) => {
        const { content, tool_call_id } = args ?? {};
        messages.push({
          role: 'tool',
          tool_call_id,
          content
        });
      });

      const toolanswer = await d.chat.completions.create({
        model,
        messages
      });

      bstack.store.emit('communication.ai', {
        text: toolanswer?.choices?.[0]?.message.content
      });
    }
  };

  useEffect(() => {
    const unsubscribe = bstack.store.on('communication.user', (e: any) => {
      processMessage(e.text);
    });

    return () => {
      unsubscribe();
    };
  }, []);
}
