const exec = require('../util/asyncExec')
const report = (...messages) => console.log('[PR Now] [Show PR in Browser]', ...messages)

async function showPRInBrowser (workingKnowledge) {
  let { ticket, cwd } = workingKnowledge
  // - Use `hub` to open a browser with the new PR so you can review and share with friends

  const hubShowPR = await exec('hub pr show', { cwd })
  report('hub:', hubShowPR.stdout, hubShowPR.stderr)

  return Object.assign({}, workingKnowledge, {
    ticket,
    cwd
  })
}

module.exports = showPRInBrowser
