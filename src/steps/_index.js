const steps = [
  'createTitleFromArguments',
  'findDefaultBranch',
  'findTicketFromBranchName',
  'findGithubIssue',
  'findJiraTicket',
  'applyDefaultsIfNeeded',
  'createBranch',
  'commitUnstagedFiles',
  'pushToRemote',
  'createAGithubPR',
  'showPRInBrowser',
  'resetGitToDefaultBranch'
]

module.exports = steps.reduce((acc, stepName) => {
  acc[stepName] = require(`./${stepName}`)
  return acc
}, {})
