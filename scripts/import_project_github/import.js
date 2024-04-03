require('dotenv').config(); // This line loads the environment variables from the .env file

const { Octokit } = require("@octokit/rest");

// Use environment variables
const authToken = process.env.AUTH_TOKEN;
const owner = process.env.OWNER;
const repo = process.env.REPO;
const octokit = new Octokit({ auth: authToken });

const {data} = require('./data.js'); // Assuming 'data' is in the correct format
const prepareIssueBody = (issue) => `
    Description:
    ${issue.description}

    Tasks:
    ${issue.tasks.join('\n\t')}
`;

const run = async () => {
    try {
        for (const milestone of data.data.project.milestones) {
            let milestoneNumber;

            // Check if the milestone already exists
            const existingMilestones = await octokit.issues.listMilestones({
                owner,
                repo,
            });

            const foundMilestone = existingMilestones.data.find(m => m.title === milestone.title);
            if (foundMilestone) {
                milestoneNumber = foundMilestone.number;
            } else {
                // Create a milestone if it doesn't exist
                const milestoneResponse = await octokit.issues.createMilestone({
                    owner,
                    repo,
                    title: milestone.title,
                    state: "open"
                });
                milestoneNumber = milestoneResponse.data.number;
            }

            // Create issues for the milestone
            if (milestone.issues) {
                for (const issue of milestone.issues) {
                    await octokit.issues.create({
                        owner,
                        repo,
                        title: issue.title,
                        body: prepareIssueBody(issue),
                        labels: issue.labels || [],
                        milestone: milestoneNumber
                    });
                }
            }
        }
        console.log('Success! All milestones and issues created or updated');
    } catch (err) {
        console.error("Failed! ", err);
    }
};

run();
