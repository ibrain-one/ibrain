'use client';
import { summarizeBrainstormTool } from './summarizeBrainstorm';

export const tools: any = {
  summarizebrainstorm: summarizeBrainstormTool
  // changeconversationlanguage: changeConversationLanguageTool,
  // generateuml:generateUMLTool
  // navigateto: navigateToFeatureTool,
};
// Tool lookup function
export const getToolByName = (name: any) => {
  return tools[name];
};
