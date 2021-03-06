const exec = require('../util/asyncExec')
const report = (...messages) => console.log('[PR Now] [Reset to default branch]', ...messages)

async function resetGitToDefaultBranch (workingKnowledge) {
  const { cwd, defaultBranchName } = workingKnowledge
  // Checkout default branch, then pull and rebase

  const gitCheckoutDefault = await exec(`git checkout ${defaultBranchName}`, { cwd })
  report('git checkout:', gitCheckoutDefault.stdout, gitCheckoutDefault.stderr)

  const gitPullAndRebase = await exec('git pull -r', { cwd })
  report('git pull:', gitPullAndRebase.stdout, gitPullAndRebase.stderr)

  return Object.assign({}, workingKnowledge, {
    cwd
  })
}

module.exports = resetGitToDefaultBranch
