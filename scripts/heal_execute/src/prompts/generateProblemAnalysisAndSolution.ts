export function generateProblemAnalysisAndSolution(command: string, errorMessage: string): string {
    // Generate a formatted prompt message
    const prompt = `
    Problem Analysis and Solution (PAS):

    Command Executed: ${command}

    Error Message:
    ${errorMessage}

    Please provide more details about the problem and any additional context that might be relevant. For example:
    - What were you trying to accomplish with this command?
    - Are there any specific error codes or messages?
    - Have you encountered this issue before, and if so, how was it resolved?

    Additionally, please provide your proposed solution or any ideas you have for fixing the problem. For example:
    - Do you know what might be causing the error?
    - Have you attempted any troubleshooting steps already?
    - Is there any additional information or resources you need to find a solution?
    
    Your input will help us better understand the issue and provide an effective solution. Thank you!
    `;

    return prompt.trim();
}