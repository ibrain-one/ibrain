'use client';
import React, { useState } from 'react';

export interface Answer {
  text: string;
}

export function QnAComponent({ model }: any) {
  const [answers, setAnswers] = useState<Answer[]>([]);

  const handleQuestion = async () => {
    const passage = `Introduction to iBrain's Core Features
      Begin by introducing iBrain as a revolutionary tool designed to empower teams and enhance workflows. Highlight the intuitive interaction with the AI assistant, emphasizing the natural, intention-driven discussions that do not require memorization of specific voice commands. Explain how iBrain understands the context of discussions and queries, providing relevant insights and taking appropriate actions based on the conversation's flow.

      Advanced Capabilities for Global Teams and Data Analysis
      Dive into the dynamic language adaptation feature, showcasing iBrain's ability to seamlessly adapt to over 90 languages, allowing users worldwide to engage in their preferred language without needing to adjust settings manually. Follow this by explaining the schema-aware data analysis capability, which leverages the database schema to generate insightful queries and extract meaningful information, all guided by the context of the ongoing discussion.

      Seamless Integration and Real-time Decision Making
      Conclude with the effortless database integration and real-time insights delivery features. Detail how iBrain integrates with popular databases like MySQL, SQL, and PostgreSQL through natural language discussions, eliminating complex manual setup processes. Emphasize the benefit of receiving real-time data insights and analytics during discussions, which supports quick decision-making and problem-solving, streamlining business operations and enhancing productivity.`;

    const question = 'Summarize iBrain?';

    if (model) {
      console.log(`MODEL FOUND`);

      const prompt = `${question} ${passage}`; // Combine question and passage
      const generatedText = await model(prompt); // Adjust max_length as needed

      // Extract the summarized text (heuristic approach)
      const summaryStart =
        generatedText[0]['generated_text'].indexOf('iBrain is');
      const summaryEnd = generatedText[0]['generated_text'].indexOf(
        '.',
        summaryStart + 1
      );
      const summary =
        summaryStart !== -1 && summaryEnd !== -1
          ? generatedText[0]['generated_text'].slice(
              summaryStart,
              summaryEnd + 1
            )
          : generatedText[0]['generated_text'];

      setAnswers([{ text: summary }]); // Update answers with summarized text
    }
  };

  return (
    <div>
      <button onClick={handleQuestion}>Find Answers</button>
      <ul>
        {answers.map((answer, index) => (
          <li key={index}>
            <p>Answer: {answer.text}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default QnAComponent;
