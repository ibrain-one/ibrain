import { createTool } from '../../../../factories/createTool';
import { ai } from '../integration/aiIntegration';
import { getSchemaMock } from '../mock/getSchemaMock';

export interface TranslateToSQLArguments {
  naturalLanguageInput: string;
}

export const translateToSQLTool = createTool(
  'translateToSQL',
  "Translates natural language to SQL queries. For example, the user could say: 'Show me all users named John.'",
  [], // Required parameters
  {
    naturalLanguageInput: {
      type: 'string',
      description:
        'The natural language input to be translated into an SQL query.'
    }
  },
  async (args: TranslateToSQLArguments) => {
    if (!args || !args.naturalLanguageInput) {
      return 'Please provide a sentence to translate into SQL.';
    }

    const input = args.naturalLanguageInput.toLowerCase();

    const aiQuery =
      await ai.askQuick(`You will understand the user intention in natural language and translate it into a SQL query.
      
Requirements:
- It is important to JOIN tables to populate informations.
- You will respond the query between these tags "<sql>" SQL QUERY HERE "</sql>".
- It is mandatory to respect schema exactly and make sure to respect case sensitive.
      
Schema:
${getSchemaMock()}
      
User Intention:
${input}
      `);

    if (aiQuery) {
      const sqlQuery = extractSqlQuery(aiQuery);
      console.log(`Generated SQL: ${sqlQuery}`);

      if (sqlQuery) {
        const answer = await handleFetchData(sqlQuery);
        const result = `Please explain to the user that the ${answer?.message}. Describe in natural language the database result following: ${JSON.stringify(answer?.results)}`;
        console.log(`RESULT = `, result);
        return result;
      }
    }

    return `Unable to generate the query, ask for clarification.`;
  }
);

const handleFetchData = async (query: string) => {
  try {
    const response = await fetch('/api/query', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        query,
        parameters: []
      })
    });

    if (!response.ok) {
      throw new Error(`Error: ${response.statusText}`);
    }

    const data = await response.json();
    return data;
  } catch (error: any) {
    console.error('Fetching error:', error);
    return error;
  }
};

function extractSqlQuery(input: string): string | null {
  // Regular expression to match content between <sql> and </sql> tags
  const regex = /<sql>(.*?)<\/sql>/s;

  // Attempt to match the regex pattern in the input string
  const match = input.match(regex);

  // If a match is found, process the first capturing group (the content between the tags)
  if (match) {
    let query = match[1];

    // Ensure the query ends with a semicolon
    if (!query.endsWith(';')) {
      query += ';';
    }

    return removeBackslashes(query);
  } else {
    // Return null to indicate no match was found
    return null;
  }
}

function removeBackslashes(query: string): string {
  return query.replace(/\\/g, '');
}
