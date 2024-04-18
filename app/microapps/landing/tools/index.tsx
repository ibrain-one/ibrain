'use client';
import { pricingTool } from './pricingTool';
import { changeConversationLanguageTool } from './languageTool';
import { subscribeTool } from './subscribeTool';
import { navigateToFeatureTool } from './navigationTool';
import { featureExplainerTool } from './featureTool';

export const tools: any = {
  pricing: pricingTool,
  changeconversationlanguage: changeConversationLanguageTool,
  subscribe: subscribeTool,
  navigateto: navigateToFeatureTool,
  features: featureExplainerTool
};
// Tool lookup function
export const getToolByName = (name: any) => {
  return tools[name];
};
