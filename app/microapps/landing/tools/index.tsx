'use client';
import { pricingTool } from './pricingTool';
import { changeConversationLanguageTool } from './languageTool';
import { subscribeTool } from './subscribeTool';
// import { navigateToFeatureTool } from './navigationTool';
import { featureExplainerTool } from './featureTool';

export const tools: any = {
  explainpricing: pricingTool,
  changeconversationlanguage: changeConversationLanguageTool,
  subscribe: subscribeTool,
  // navigateto: navigateToFeatureTool,
  explainfeatures: featureExplainerTool
};
// Tool lookup function
export const getToolByName = (name: any) => {
  return tools[name];
};
