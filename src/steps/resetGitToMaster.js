const exec = require('../util/asyncExec')
const report = (...messages) => console.log('[PR Now] [Reset to master]', ...messages)

async function resetGitToMaster ({ cwd }) {
  // Checkout master branch, then pull and rebase

  const gitCheckoutMaster = await exec('git checkout master', { cwd })
  report('git checkout:', gitCheckoutMaster.stdout, gitCheckoutMaster.stderr)

  const gitPullAndRebase = await exec('git pull -r', { cwd })
  report('git pull:', gitPullAndRebase.stdout, gitPullAndRebase.stderr)

  return {
    cwd
  }
}

module.exports = resetGitToMaster
