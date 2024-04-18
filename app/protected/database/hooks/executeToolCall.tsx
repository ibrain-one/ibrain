'use client';
import { core } from '@/app/providers/brainstack';
import { getToolByName } from '../tools';

export const executeToolCall = async (toolCall: any) => {
  const tool = getToolByName(String(toolCall.function.name).toLowerCase());
  if (!tool) {
    core.log.error(
      `No tool found with name: ${String(toolCall.function.name).toLowerCase()}`
    );
    return null;
  }

  try {
    const args = JSON.parse(toolCall.function.arguments);
    core.log.verbose(
      `Tool Call Function Name: ${String(toolCall.function.name).toLowerCase()} with argument`,args
    );
    const content = await tool.execute(args);
    core.log.verbose(
      `Tool Call Function Name: ${String(toolCall.function.name).toLowerCase()} with argument`,args, ` Result: `, content
    );
    return {
      content,
      tool_call_id: toolCall.id
    };
  } catch (error) {
    core.log.error(`Error executing tool ${toolCall.function.name}:`, error);
    return null;
  }
};
