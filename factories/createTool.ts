import { ChatCompletionTool } from 'openai/resources';

export type ExecuteFunction = (...args: any[]) => Promise<any>;

interface Tool {
  definition: ChatCompletionTool;
  execute: ExecuteFunction;
}

export const createTool = (
  name: string,
  description: string,
  required: string[],
  properties: Record<string, any>,
  executeFn: ExecuteFunction // The callback function to execute
): Tool => {
  // Tool definition
  const toolDefinition: ChatCompletionTool = {
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

  // Separating the definition and the execute function
  return {
    definition: toolDefinition,
    execute: executeFn
  };
};
