import { useEffect, useState } from 'react';
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

export type ListeningMode = 'discussion' | 'active_listening';

export const useCommunicationManager = (
  options: UseCommunicationManagerOptions
) => {
  const bstack = useBrainStack();
  const [listeningMode, setListeningMode] =
    useState<ListeningMode>('discussion');
  const [accumulatedMessages, setAccumulatedMessages] = useState<
    Communication[]
  >([]);
  const [lastUserMessageTime, setLastUserMessageTime] = useState<Date | null>(
    null
  );

  const addCommunication = (role: 'user' | 'assistant', content: string) => {
    const processedContent = content;
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

  const getHistory = (limit: number): string => {
    try {
      const history = bstack.store.getState()?.history || [];
      const historyLength = history.length;

      if (historyLength <= 1) {
        return 'It is the first message, there is no history.';
      }

      const start = historyLength - Math.min(limit, historyLength);
      const result = history.slice(start, historyLength - 1);

      return convertHistoryToReadableText(result);
    } catch (e) {
      return 'Error retrieving history.';
    }
  };

  const convertHistoryToReadableText = (history: Communication[]): string => {
    if (history.length === 0) {
      return 'No history available.';
    }

    const messages = history.map((item, index) => {
      const role = item.role === 'user' ? 'User' : 'Assistant';
      const timestamp = item.timestamp.toLocaleString(); // Adjust as needed for date formatting

      return `${role} said "${item.content}" at ${timestamp}`;
    });

    return messages.join('\n');
  };

  const processAccumulatedMessages = () => {
    const combinedMessage = accumulatedMessages
      .map((msg) => msg.content)
      .join(' ');
    addCommunication('user', combinedMessage);
    setAccumulatedMessages([]);
    bstack.store.emit('communication.user', { text: combinedMessage });
    setListeningMode('discussion'); // Reset to discussion mode after processing
  };

  const handleUserMessage = async (content: string) => {
    const newMessage: Communication = {
      role: 'user',
      content,
      timestamp: new Date()
    };

    if (listeningMode === 'discussion') {
      const switchToActiveListening =
        await aiSelfThoughtCheckForActiveListening(content);
      if (switchToActiveListening) {
        setListeningMode('active_listening');
        const combinedMessage = `${content} Okay, I'm actively listening to you.`;
        addCommunication('user', combinedMessage);
        bstack.store.emit('communication.user', { text: combinedMessage });
      } else {
        addCommunication('user', content);
        bstack.store.emit('communication.user', { text: content });
      }
    } else {
      setAccumulatedMessages([...accumulatedMessages, newMessage]);
      setLastUserMessageTime(new Date());

      // AI self-thought to decide whether to process accumulated messages
      const shouldProcess = await aiSelfThoughtCheck();
      if (shouldProcess) {
        processAccumulatedMessages();
      }
    }
  };

  const aiSelfThoughtCheck = async (): Promise<boolean> => {
    // Simulate AI self-thought process
    // In a real-world scenario, this would involve more complex AI logic
    return new Promise((resolve) => {
      setTimeout(() => {
        const selfThoughtDecision = accumulatedMessages.length > 0; // Simple check for now
        resolve(selfThoughtDecision);
      }, 1000); // Simulate delay for AI self-thought
    });
  };

  const aiSelfThoughtCheckForActiveListening = async (
    content: string
  ): Promise<boolean> => {
    // Check if the user message indicates switching to active listening mode
    return new Promise((resolve) => {
      setTimeout(() => {
        const switchToActiveListening = content
          .toLowerCase()
          .includes('active'); // Check for trigger phrase
        resolve(switchToActiveListening);
      }, 1000); // Simulate delay for AI self-thought
    });
  };

  const addAICommunication = (content: string) => {
    addCommunication('assistant', content);
    bstack.store.emit('communication.ai', { text: content });
  };

  useEffect(() => {
    const unsubscribeSpeech = bstack.store.on(
      'speech2text.result',
      (e: any) => {
        handleUserMessage(e.text);
      }
    );

    return () => {
      unsubscribeSpeech();
    };
  }, [listeningMode, accumulatedMessages]);

  useEffect(() => {
    const unsubscribeSpeak = bstack.store.on('ibrain.speak', (e: any) => {
      addAICommunication(e.text);
    });

    return () => {
      unsubscribeSpeak();
    };
  }, []);

  useEffect(() => {
    if (listeningMode === 'active_listening' && lastUserMessageTime) {
      const interval = setInterval(async () => {
        if (new Date().getTime() - lastUserMessageTime.getTime() > 20000) {
          // 60 seconds of silence
          addAICommunication('Are you still with me?');
          clearInterval(interval);
        }
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [lastUserMessageTime, listeningMode]);

  return {
    getHistory,
    setListeningMode,
    processAccumulatedMessages
  };
};
