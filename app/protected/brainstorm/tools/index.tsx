'use client';

export const tools: any = {
  // changeconversationlanguage: changeConversationLanguageTool,
  // generateuml:generateUMLTool
  // navigateto: navigateToFeatureTool,
};
// Tool lookup function
export const getToolByName = (name: any) => {
  return tools[name];
};
