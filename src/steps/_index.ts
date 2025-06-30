import createTitleFromArguments from './createTitleFromArguments'
import findDefaultBranch from './findDefaultBranch'
import findTicketFromBranchName from './findTicketFromBranchName'
import findGithubIssue from './findGithubIssue'
import findJiraTicket from './findJiraTicket'
import applyDefaultsIfNeeded from './applyDefaultsIfNeeded'
import createBranch from './createBranch'
import commitUnstagedFiles from './commitUnstagedFiles'
import pushToRemote from './pushToRemote'
import createAGithubPR from './createAGithubPR'
import showPRInBrowser from './showPRInBrowser'
import resetGitToDefaultBranch from './resetGitToDefaultBranch'

export default {
  createTitleFromArguments,
  findDefaultBranch,
  findTicketFromBranchName,
  findGithubIssue,
  findJiraTicket,
  applyDefaultsIfNeeded,
  createBranch,
  commitUnstagedFiles,
  pushToRemote,
  createAGithubPR,
  showPRInBrowser,
  resetGitToDefaultBranch
}
