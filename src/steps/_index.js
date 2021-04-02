const steps = [
  'createTitleFromArguments',
  'findTicketFromBranchName',
  'findGithubIssue',
  'findJiraTicket',
  'applyDefaultsIfNeeded',
  'createBranch',
  'commitUnstagedFiles',
  'pushToRemote',
  'createAGithubPR',
  'showPRInBrowser',
  'resetGitToMaster'
]

module.exports = steps.reduce((acc, stepName) => {
  acc[stepName] = require(`./${stepName}`)
  return acc
}, {})
