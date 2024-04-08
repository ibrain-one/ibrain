import { useEffect } from 'react';
import { useBrainStack } from '../providers/brainstack';

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
  const addCommunication = (role: 'user' | 'assistant', content: string) => {
    const processedContent = content;
    // role === 'user'
    //   ? processMessage(content, options.userMessageCustomProcessHandler)
    //   : processMessage(content, options.aiMessageCustomProcessHandler);

    const newCommunication: Communication = {
      role,
      content: processedContent,
      timestamp: new Date()
    };

    bstack.store.mutate((s) => ({
      ...s,
      history: [...s?.history, newCommunication]
    }));
  };

  const getHistory = (limit: number = history.length): CommunicationHistory => {
    return bstack.store.getState()?.history?.slice(-limit);
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

  useEffect(() => {
    const unsubscribe = bstack.store.on('speech2text.result', (e: any) => {
      addUserCommunication(e.text);
    });

    return () => {
      unsubscribe();
    };
  }, []);
  
  useEffect(() => {
    const unsubscribe = bstack.store.on('ibrain.speak', (e: any) => {
      addAICommunication(e.text);
    });

    return () => {
      unsubscribe();
    };
  }, []);

  return {
    getHistory
  };
};
