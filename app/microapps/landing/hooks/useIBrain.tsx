'use client';
import { useCommunicationManager } from '@/app/hooks/useCommunicationManager';
import { useBrainStack } from '@/app/providers/brainstack';
import { ChatCompletionMessageParam } from 'openai/resources';
import { useEffect } from 'react';
import { ai } from '../integration/aiIntegration';
import useEvents from '../events/useEvents';
import { executeToolCall } from './executeToolCall';
import { generatePrompt } from '../prompts';

export default function useIBrain() {
  const bstack = useBrainStack();
  // DONT USE useCommunciationManager() twice
  const { getHistory } = useCommunicationManager({});
  // const promptBuilderMock = (action: string, message: string) =>
  //   `Prompt Test: action: ${action} message: ${message} history: ` +
  //   getHistory(5);

  // const messages: Array<ChatCompletionMessageParam> = getHistory(5); //[];

  const processUserMessage = async (text: string) => {
    const messages: Array<ChatCompletionMessageParam> = [
      {role:'system', content:`Your name is iBrain and you are the a website AI assistant. You will call apprropriate function. Don't make assumptions about what values to plug into functions. Ask for clarification if a user request is ambiguous.`},
      { role: 'user', content: text }
    ];

    const answer = await ai.askWithTools(messages);

    bstack.log.verbose(answer);

    if (!answer?.choices?.[0]?.message?.tool_calls) {
      bstack.log.verbose(
        'No tool calls:',
        answer?.choices?.[0]?.message.content
      );
      bstack.store.emit('ibrain.speak', {
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
          content: `You will answer back in following language: ${bstack.store.getState()?.language ?? 'en-CA'}\n${content}`
        });
      });

      const toolanswer = await ai.askWithTools(messages);

      bstack.store.emit('ibrain.speak', {
        text: toolanswer?.choices?.[0]?.message.content?.trim()
      });
    }
  };

  useEffect(() => {
    const unsubscribe = bstack.store.on('communication.user', (e: any) => {
      processUserMessage(e.text);
    });

    return () => {
      unsubscribe();
    };
  }, []);

  // Action events
  useEvents();
}
