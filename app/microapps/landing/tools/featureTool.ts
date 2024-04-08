import { createTool } from '../../../../factories/createTool';

interface FeatureExplainerArguments {
  feature?: string; 
}

export const featureExplainerTool = createTool(
  'explainFeatures',
  'Explains the voice-driven features of iBrain Data, allowing users to interact with their business data through natural language.',
  ['feature'], 
  {
    feature: {
      type: 'string',
      description: 'Specific feature to explain (optional).'
    }
  },
  async (args?: FeatureExplainerArguments) => {
    let instructionForAI: string;
    const feature = args?.feature?.toLowerCase() ?? 'all';

    switch (feature) {
      case 'voice-driven':
        instructionForAI = `Detail the voice-driven interaction feature, emphasizing how users can query and analyze their business data using natural language. Highlight the convenience and efficiency of being able to talk directly to iBrain Data, as if conversing with a knowledgeable assistant. Explain the technology's support for multiple languages and its ability to understand complex queries.`;
        break;
      case 'data-integration':
        instructionForAI = `Explain the data integration capabilities of iBrain Data, illustrating how users can connect various data sources seamlessly. Emphasize the tool's ability to aggregate and interpret data from these sources, enabling comprehensive insights and analysis through voice commands.`;
        break;
      default:
        instructionForAI = `Provide an overview of iBrain Data's key features, including its voice-driven interface that allows users to interact with their business data through natural language. Mention the ease of integrating multiple data sources and the platform's support for advanced query generation and visualization capabilities. Encourage the user to explore these features to enhance their data interaction experience.`;
    }

    return instructionForAI;
  }
);
