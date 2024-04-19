import { createTool } from '../../../../factories/createTool';
import { DiagramModule } from '@brainstack/diagram';

export interface GenerateUMLArguments {
  naturalLanguageDescription: string;
  plantUMLCode: string;
}

export const generateUMLTool = createTool(
  'generateUML',
  'Generates PlantUML diagrams from natural language descriptions and PlantUML code.',
  [], // Required parameters
  {
    naturalLanguageDescription: {
      type: 'string',
      description:
        'A natural language description of the diagram to be generated.'
    },
    plantUMLCode: {
      type: 'string',
      description: 'The PlantUML code representing the diagram.'
    }
  },
  async (args: GenerateUMLArguments) => {
    if (!args || !args.naturalLanguageDescription || !args.plantUMLCode) {
      return 'Please provide a natural language description and PlantUML code.';
    }

    const { naturalLanguageDescription, plantUMLCode } = args;
    console.log(`plant uml code: ${plantUMLCode}`);

    const diagramUrl = DiagramModule.generate_img(plantUMLCode);

    const response = `Generated PlantUML diagram from the description: "${naturalLanguageDescription}". You can view the diagram [here](${diagramUrl}).`;

    return response;
  }
);
