const exec = require('../util/asyncExec')
const report = (...messages) => console.log('[PR Now] [Reset to main]', ...messages)

async function resetGitToMain ({ cwd }) {
  // Checkout main branch, then pull and rebase

  const gitCheckoutMain = await exec('git checkout main', { cwd })
  report('git checkout:', gitCheckoutMain.stdout, gitCheckoutMain.stderr)

  const gitPullAndRebase = await exec('git pull -r', { cwd })
  report('git pull:', gitPullAndRebase.stdout, gitPullAndRebase.stderr)

  return {
    cwd
  }
}

module.exports = resetGitToMain
