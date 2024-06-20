import { exec } from 'child_process';
import { ai } from './integration/aiIntegration';
import { generateProblemAnalysisAndSolution } from './prompts/generateProblemAnalysisAndSolution';

function executeCommand(command: string): Promise<string> {
  return new Promise((resolve, reject) => {
    exec(command, (error, stdout, stderr) => {
      if (error) {
        reject(stderr);
      } else {
        resolve(stdout);
      }
    });
  });
}

async function executeAndHandleError(command: string) {
  try {
    const output = await executeCommand(command);
    console.log('Command executed successfully. Output:', output);
  } catch (error) {
    console.error('Error occurred:', error);
    // Prompt for solution to fix the error
    // Assuming manual intervention to fix the error
    const solution = await promptForSolution(
      generateProblemAnalysisAndSolution(command, String(error))
    );
    console.log('Applying solution:', solution);
    // Update the command according to the solution
    if (solution) {
      const updatedCommand = updateCommand(command, solution);
      console.log('Retrying with updated command:', updatedCommand);
    }
    // await executeAndHandleError(updatedCommand);
  }
}

async function promptForSolution(context: string) {
  // Implement your logic to prompt for a solution
  // For simplicity, let's assume manual intervention
  // You can use libraries like readline-sync for synchronous input
  // Or prompt-sync for asynchronous input
  // Here, I'm just returning a hardcoded solution for demonstration
  const solution = await ai.askQuick(context);
  return solution;
}

function updateCommand(command: string, solution: string): string {
  // Implement logic to update the command based on the solution
  // For demonstration, just adding a comment to the command
  return command + ` # Solution: ${solution}`;
}

// Usage
const commandToExecute =
  '/usr/bin/python3 /home/nitr0gen/ibrain/scripts/ai_playground/train/my_ibrain_data_project/code/train_model.py '; //process.argv.slice(2).join(' '); // Extract command from arguments
executeAndHandleError(commandToExecute);
