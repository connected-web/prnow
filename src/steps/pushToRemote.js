const exec = require('../util/asyncExec')
const report = (...messages) => console.log('[PR Now] [Push to Remote]', ...messages)

async function pushToRemote (workingKnowledge) {
  const { ticket, ticketTitle, ticketUrl, branchName, cwd } = workingKnowledge
  try {
    const pushToRemote = await exec('git push', { cwd })
    report('git push:', pushToRemote.stdout, pushToRemote.stderr)
  } catch (ex) {
    if (/no upstream branch/.test(ex.message)) {
      const pushToUpstream = await exec(`git push --set-upstream origin "${branchName}"`, { cwd })
      report('git push:', pushToUpstream.stdout, pushToUpstream.stderr)
    }
  }

  return Object.assign({}, workingKnowledge, {
    ticket,
    ticketTitle,
    ticketUrl,
    cwd
  })
}

module.exports = pushToRemote
