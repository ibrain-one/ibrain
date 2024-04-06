import { useState } from 'react';
import { getValue, useBrainStack } from '../providers/brainstack';

export type MessageProcessor = (message: string) => string;

export interface UseCommunicationManagerOptions {
  userMessageCustomProcessHandler?: MessageProcessor[];
  aiMessageCustomProcessHandler?: MessageProcessor[];
}

export interface Communication {
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

export type CommunicationHistory = Communication[];

export const useCommunicationManager = (
  options: UseCommunicationManagerOptions
) => {
  const bstack = useBrainStack();
  const [history, setHistory] = useState<CommunicationHistory>([]);
  const h: CommunicationHistory = getValue('history');

  const processMessage = (
    message: string,
    processors: MessageProcessor[] = []
  ): string => {
    return processors.reduce((acc, process) => process(acc), message);
  };

  const addCommunication = (role: 'user' | 'assistant', content: string) => {
    const processedContent =
      role === 'user'
        ? processMessage(content, options.userMessageCustomProcessHandler)
        : processMessage(content, options.aiMessageCustomProcessHandler);

    const newCommunication: Communication = {
      role,
      content: processedContent,
      timestamp: new Date()
    };

    setHistory((prevHistory) => [...prevHistory, newCommunication]);
    bstack.store.mutate((s) => ({
      ...s,
      history: [...s?.history, newCommunication]
    }));
  };

  const getHistory = (limit: number = history.length): CommunicationHistory => {
    // return history.slice(-limit);
    return h.slice(-limit);
  };

  // Public method to add user communication
  const addUserCommunication = (content: string) => {
    addCommunication('user', content);
    bstack.store.emit('communication.user', { text: content });
  };

  // Public method to add AI communication
  const addAICommunication = (content: string) => {
    addCommunication('assistant', content);
    bstack.store.emit('communication.ai', { text: content });
  };

  bstack.useOn(
    'speech2text.result',
    (e: any) => {
      addUserCommunication(e.text);
    },
    []
  );

  bstack.useOn(
    'ibrain.speak',
    (e: any) => {
      addAICommunication(e.text);
    },
    []
  );

  return {
    getHistory
  };
};
