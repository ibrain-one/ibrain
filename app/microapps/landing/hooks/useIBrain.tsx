'use client';
import { useCommunicationManager } from '@/app/hooks/useCommunicationManager';
import { useBrainStack } from '@/app/providers/brainstack';
import { ChatCompletionMessageParam } from 'openai/resources';
import { useEffect } from 'react';
import { ai, } from '../integration/aiIntegration';
import useEvents from '../events/useEvents';
import { executeToolCall } from './executeToolCall';


export default function useIBrain() {
  const bstack = useBrainStack();
  // DONT USE useCommunciationManager() twice
  const { getHistory } = useCommunicationManager({});
  // const promptBuilderMock = (action: string, message: string) =>
  //   `Prompt Test: action: ${action} message: ${message} history: ` +
  //   getHistory(5);

  const messages: Array<ChatCompletionMessageParam> = getHistory(5)//[];
  

  const processUserMessage = async (text: string) => {
    messages.push({ role: 'user', content: text });

    const answer = await ai.askWithTools(messages)

    bstack.log.verbose(answer);

    if (!answer?.choices?.[0]?.message?.tool_calls) {
      bstack.log.verbose('No tool calls:', answer?.choices?.[0]?.message.content);
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

      const toolanswer = await ai.ask(messages);

      bstack.store.emit('communication.ai', {
        text: toolanswer?.choices?.[0]?.message.content
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
