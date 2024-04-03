# `/scripts` Directory Overview

The `/scripts` directory is a centralized hub for automation scripts within the iBrain project, crafted to streamline various aspects of development and project management. These scripts are designed to automate repetitive tasks, ensuring efficiency and consistency across the project lifecycle.

## Tools and Scripts

Within this directory, you will find individual folders for each script, encapsulating its related files for a more organized structure. Currently, the directory includes the following tool:

### `import_project_github`

- **Purpose:** Facilitates the automated import of project milestones, issues, and tasks into GitHub, directly from a structured JSON file.
- **Components:**
  - `README.md`: Detailed documentation on the tool's purpose, setup, and usage instructions.
  - `data.js`: The structured JSON file containing the project's milestones, issues, and tasks.
  - `import.js`: The main script that interacts with the GitHub API to create milestones and issues based on `data.js`.

## Getting Started

To use the scripts in this directory:

1. Navigate to the specific script's folder you wish to run.
2. Follow the instructions outlined in the `README.md` file within that folder.

