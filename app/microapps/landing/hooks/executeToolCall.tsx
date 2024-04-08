'use client';
import { getToolByName } from '../tools';

export const executeToolCall = async (toolCall: any) => {
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
