import exec from '../util/asyncExec'
import isNumeric from '../util/isNumeric'
const report = (...messages: any[]) => console.log('[PR Now] [Find Github Issue]', ...messages)

export interface WorkingKnowledge {
  ticket?: string
  ticketTitle?: string
  ticketUrl?: string
  cwd?: string
  [key: string]: any
}

export default async function findGithubIssue (workingKnowledge: WorkingKnowledge): Promise<WorkingKnowledge> {
  let { ticket, ticketTitle, cwd } = workingKnowledge
  let issueTitle: string | undefined, issueUrl: string | undefined, ticketUrl: string | undefined
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
