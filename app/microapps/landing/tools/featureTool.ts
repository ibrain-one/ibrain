import { createTool } from '../../../../factories/createTool';

export const featureExplainerTool = createTool(
  'features',
  'Useful to explains iBrain Data features.',
  [],
  {},
  async () => {
    let instructionForAI: string = `Explain the iBrain Data using the following informations. It is important that you keep the section delimiter in your response. They are identified ##Action:SectionTwo## ##Action:SectionOne## ##Action:SectionThree## and they will be used to trigger UI accoding in sync with your response. Therefore they must be included in your response accordingly.
        
    ##Action:SectionOne##
    Introduction to iBrain's Core Features
    Begin by introducing iBrain as a revolutionary tool designed to empower teams and enhance workflows. Highlight the intuitive interaction with the AI assistant, emphasizing the natural, intention-driven discussions that do not require memorization of specific voice commands. Explain how iBrain understands the context of discussions and queries, providing relevant insights and taking appropriate actions based on the conversation's flow.
    
    ##Action:SectionTwo## 
    Advanced Capabilities for Global Teams and Data Analysis
    Dive into the dynamic language adaptation feature, showcasing iBrain's ability to seamlessly adapt to over 90 languages, allowing users worldwide to engage in their preferred language without needing to adjust settings manually. Follow this by explaining the schema-aware data analysis capability, which leverages the database schema to generate insightful queries and extract meaningful information, all guided by the context of the ongoing discussion.
    
    ##Action:SectionThree##
    Seamless Integration and Real-time Decision Making
    Conclude with the effortless database integration and real-time insights delivery features. Detail how iBrain integrates with popular databases like MySQL, SQL, and PostgreSQL through natural language discussions, eliminating complex manual setup processes. Emphasize the benefit of receiving real-time data insights and analytics during discussions, which supports quick decision-making and problem-solving, streamlining business operations and enhancing productivity.`;

    return instructionForAI;
  }
);
