const steps = require('../steps/_index')
const {
  createTitleFromArguments, findTicketFromBranchName,
  findGithubIssue, findJiraTicket,
  applyDefaultsIfNeeded, createBranch, commitUnstagedFiles,
  pushToRemote, createAGithubPR, showPRInBrowser
} = steps

const defaultMode = {
  name: 'Just Pull Request it Already!',
  setup: ({ command, args, cwd }) => {
    const workingKnowledge = {
      ticket: command,
      args,
      cwd
    }
    return workingKnowledge
  },
  steps: {
    'Create Title from Arguments': createTitleFromArguments,
    'Find Ticket from Branch Name': findTicketFromBranchName,
    'Find Github Issue': findGithubIssue,
    'Find Jira Ticket': findJiraTicket,
    'Apply Defaults if Needed': applyDefaultsIfNeeded,
    'Create Branch': createBranch,
    'Commit Unstaged Files': commitUnstagedFiles,
    'Push to Remote': pushToRemote,
    'Create A Github PR': createAGithubPR,
    'Show PR in Browser': showPRInBrowser
  }
}

module.exports = defaultMode
