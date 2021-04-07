const exec = require('../util/asyncExec')
const report = (...messages) => console.log('[PR Now] [Find Default Branch]', ...messages)

async function findDefaultBranch (workingKnowledge) {
  const { ticket, ticketTitle, ticketUrl, cwd } = workingKnowledge
  // - Find the default branch for this repo

  let defaultBranchName = 'main'

  try {
    const originInformation = (await exec('git remote show origin', { cwd })).stdout
    defaultBranchName = originInformation.split('\n').filter(n => n.includes('HEAD branch'))[0].trim().split(':')[1].trim()
    report('Found:', defaultBranchName)
  } catch (ex) {
    report('Unable to discern default branch name from origin:', ex.message)
  }

  return Object.assign({}, workingKnowledge, {
    ticket,
    ticketTitle,
    ticketUrl,
    defaultBranchName,
    cwd
  })
}

module.exports = findDefaultBranch
