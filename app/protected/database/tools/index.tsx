'use client';
import { generateUMLTool } from './generateUMLTool';
import { changeConversationLanguageTool } from './languageTool';
import { translateToSQLTool } from './query';
// import { navigateToFeatureTool } from './navigationTool';

export const tools: any = {
  // changeconversationlanguage: changeConversationLanguageTool,
  translatetosql: translateToSQLTool,
  generateuml:generateUMLTool
  // navigateto: navigateToFeatureTool,
};
// Tool lookup function
export const getToolByName = (name: any) => {
  return tools[name];
};
