# Import Project to GitHub Tool

The `import_project_github` tool is designed to automate the process of setting up a GitHub repository with predefined milestones, issues, and tasks, eliminating the need for manual entry and ensuring a quick start to project tracking and management.

## Purpose

This tool aims to streamline the initial setup of project management structures within GitHub, allowing project managers and developers to focus on development rather than administrative tasks.

## Components

- `README.md`: Provides detailed information about the tool, including how to set it up and run it.
- `data.js`: Contains the project structure in a JSON format, including milestones, issues, and associated tasks.
- `import.js`: The script that reads from `data.js` and uses the GitHub API to populate a GitHub repository with the corresponding milestones and issues.

## Setup and Usage

1. **Preparation:**
   - Ensure you have Node.js installed on your system.
   - Clone the iBrain project repository and navigate to the `/scripts/import_project_github` directory.

2. **Installation:**
   - Run `npm install` to install necessary dependencies, including `dotenv` for environment variables and `@octokit/rest` for GitHub API interactions.

3. **Configuration:**
   - Create a `.env` file in the same directory as `import.js`, specifying your GitHub token, and the owner and repository name where you want to import the project structure:
     ```
     AUTH_TOKEN=<Your_GitHub_Personal_Access_Token>
     OWNER=<GitHub_Username_Or_Organization>
     REPO=<Repository_Name>
     ```

4. **Running the Script:**
   - Execute `node import.js` to start the import process. The script will read `data.js` and create the defined milestones and issues in your specified GitHub repository.

## Security Note

Keep your `.env` file secure and never commit it to version control. Always ensure it is listed in your `.gitignore` file to prevent accidental exposure of sensitive information.

