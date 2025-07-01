import steps from '../steps/_index'
import fs from 'fs'
import path from 'path'

const packageJson = JSON.parse(fs.readFileSync(path.join(__dirname, '../../package.json'), 'utf-8'))
const packageVersion = packageJson.version ?? 'u.v.0'

const {
  findDefaultBranch,
  createTitleFromArguments, findTicketFromBranchName,
  findGithubIssue, findJiraTicket,
  applyDefaultsIfNeeded, createBranch, commitUnstagedFiles,
  pushToRemote, createAGithubPR, showPRInBrowser
} = steps

const defaultMode = {
  name: `Just Pull Request it Already! [${packageVersion}]`,
  setup: ({ command, args, cwd }: { command: string, args: string[], cwd: string }) => {
    const workingKnowledge = {
      ticket: command,
      args,
      cwd
    }
    return workingKnowledge
  },
  steps: {
    'Find default branch': findDefaultBranch,
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

export default defaultMode
