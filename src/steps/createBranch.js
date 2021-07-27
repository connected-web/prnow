const exec = require('../util/asyncExec')
const createBranchNameSlug = require('../util/createBranchNameSlug')
const report = (...messages) => console.log('[PR Now] [Create Branch]', ...messages)

const LEGACY_PATH_SEPARATOR = '/'
const BRANCH_PATH_SEPARATOR = '.'

async function createBranch (workingKnowledge) {
  const { ticket, ticketTitle, ticketUrl, cwd } = workingKnowledge
  // - Create a branch equivalent to the ticket name

  const currentBranchName = (await exec('git branch', { cwd })).stdout.split('\n').filter(n => /\* /.test(n))[0].substr(2)
  report('Current Branch Name', currentBranchName)

  const titleSlug = createBranchNameSlug(ticketTitle)
  const legacyBranchName = [ticket, titleSlug].join(LEGACY_PATH_SEPARATOR)
  const extendedBranchName = [ticket, titleSlug].join(BRANCH_PATH_SEPARATOR)
  const branchName = ticketTitle ? extendedBranchName : ticket

  const checkForExactMatch = branchName
  const checkForLegacyTicket = legacyBranchName
  const checkForExtendedTicket = extendedBranchName

  const outcomes = {}
  outcomes[checkForExactMatch] = alreadyOnBranch
  outcomes[checkForLegacyTicket] = switchToNewBranchFormat
  outcomes[checkForExtendedTicket] = reusingExistingBranch
  outcomes.default = checkoutNewBranch

  const action = outcomes[currentBranchName] || outcomes.default
  await action({ branchName, report })

  async function alreadyOnBranch ({ branchName, report }) {
    report(`Already on branch ${branchName}`)
  }

  async function switchToNewBranchFormat ({ branchName, report }) {
    report('Switching to new branch format:', branchName)
  }

  async function reusingExistingBranch ({ branchName, report }) {
    report('Reusing existing branch:', branchName)
  }

  async function checkoutNewBranch ({ branchName, report }) {
    const { stdout, stderr } = await exec(`git checkout -b "${branchName}"`, { cwd })
    report('git checkout:', stdout, stderr)
  }

  return Object.assign({}, workingKnowledge, {
    ticket,
    ticketTitle,
    ticketUrl,
    branchName,
    cwd
  })
}

module.exports = createBranch
