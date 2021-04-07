const exec = require('../util/asyncExec')
const createBranchNameSlug = require('../util/createBranchNameSlug')
const report = (...messages) => console.log('[PR Now] [Create Branch]', ...messages)

async function createBranch (workingKnowledge) {
  const { ticket, ticketTitle, ticketUrl, cwd } = workingKnowledge
  // - Create a branch equivalent to the ticket name

  const currentBranchName = (await exec('git branch', { cwd })).stdout.split('\n').filter(n => /\* /.test(n))[0].substr(2)
  report('Current Branch Name', currentBranchName)

  let branchName = ticketTitle ? `${ticket}/${createBranchNameSlug(ticketTitle)}` : ticket

  if (currentBranchName === branchName) {
    report(`Already on branch ${currentBranchName}`)
  } else if (branchName.split('/')[0] === currentBranchName.split('/')[0]) {
    branchName = currentBranchName
    report('Reusing existing branch:', branchName)
  } else {
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
