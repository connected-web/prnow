const exec = require('../util/asyncExec')
const report = (...messages) => console.log('[PR Now] [Find Github Issue]', ...messages)

const isNumeric = require('../util/isNumeric')

async function findGithubIssue (workingKnowledge) {
  let { ticket, ticketTitle, cwd } = workingKnowledge
  let issueTitle, issueUrl, ticketUrl
  const issueNumber = Number.parseInt((ticket + '').split('/')[0].replace('#', ''))
  if (isNumeric(issueNumber)) {
    const { stdout, stderr } = await exec(`hub issue show ${issueNumber} -f "%t-|@|-%U"`)

    if (stderr) {
      report('No github issue found:', stderr)
    } else {
      [issueTitle, issueUrl] = stdout.trim().split('-|@|-')
      ticket = '#' + issueNumber
      if (!ticketTitle) {
        ticketTitle = issueTitle
      }
      ticketUrl = issueUrl
      report('Using:', ticket, ticketTitle, ticketUrl)
    }
  }

  return Object.assign({}, workingKnowledge, {
    ticket,
    ticketTitle,
    ticketUrl,
    cwd
  })
}

module.exports = findGithubIssue
