import { useCallback, useState } from 'react';

interface TIBrainInput {
  apiKey: string;
  aiIntegration: 'openai' | 'togetherai';
}

interface ToolDefinition<TArgs, TResult> {
  name: string;
  description: string;
  execute: (args: TArgs) => Promise<TResult>;
}

interface TIBrainAddSensoryInput<E, A, TArgs, TResult> {
  eventType: E;
  actionType: A;
  tools: ToolDefinition<TArgs, TResult>[];
}

interface PromptContext<E, A> {
  eventType: E;
  actionType: A;
  userState: any; // Consider using a more specific type or generics for userState and applicationState
  applicationState: any;
}

type PromptBuilderFunction<E, A> = (context: PromptContext<E, A>) => string;

interface PromptRegistration<E, A> {
  eventType: E;
  actionType: A;
  builderFunction: PromptBuilderFunction<E, A>;
}

// Factory function definition
export function createUseIBrain<E, A, TArgs, TResult>({
  apiKey,
  aiIntegration
}: TIBrainInput) {
  // The generated custom hook
  return function useIBrain() {
    const [promptMap, setPromptMap] = useState<
      Map<string, PromptBuilderFunction<any, any>>
    >(new Map());

    const buildPrompt = useCallback(
      <E, A>(eventType: E, actionType: A): string => {
        const key = `${eventType}_${actionType}`;
        const builderFunction = promptMap.get(key);
        if (!builderFunction) {
          console.warn(`No prompt builder registered for ${key}`);
          return '';
        }
        return builderFunction({
          eventType,
          actionType,
          userState: {},
          applicationState: {}
        });
      },
      [promptMap]
    );

    const registerPrompt = useCallback(
      <E, A>(registration: PromptRegistration<E, A>) => {
        const { eventType, actionType, builderFunction } = registration;
        const key = `${eventType}_${actionType}`;
        setPromptMap(new Map(promptMap.set(key, builderFunction)));
      },
      [promptMap]
    );

    const removePrompt = useCallback(
      <E, A>(eventType: E, actionType: A) => {
        const key = `${eventType}_${actionType}`;
        const newMap = new Map(promptMap);
        newMap.delete(key);
        setPromptMap(newMap);
      },
      [promptMap]
    );

    const listPrompts = useCallback(() => {
      return Array.from(promptMap.keys()).map((key) => {
        const [eventType, actionType] = key.split('_');
        return { eventType, actionType };
      });
    }, [promptMap]);

    const addSensoryInput = useCallback(
      (input: TIBrainAddSensoryInput<E, A, TArgs, TResult>) => {
        // Process and handle the sensory input
        // This is a placeholder for your logic to handle the input
        console.log(
          `Processing sensory input for eventType: ${input.eventType} and actionType: ${input.actionType}`
        );
        // // add bstack.store.on(input.eventType,(e)=>{
        // create prompt for action Type with context tools etc..
        const prompt = buildPrompt(input.eventType, input.actionType);
        // createAITask(prompt, tools)
        // })
      },
      [buildPrompt]
    );

    return {
      addSensoryInput,
      buildPrompt,
      registerPrompt,
      removePrompt,
      listPrompts
    };
  };
}
