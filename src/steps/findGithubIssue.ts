import { reportFactory } from '../util/report'
import exec from '../util/asyncExec'
import isNumeric from '../util/isNumeric'
const report = (...messages: unknown[]): void => console.log('[PR Now] [Find Github Issue]', ...messages)

export interface WorkingKnowledge {
  ticket?: string
  ticketTitle?: string
  ticketUrl?: string
  cwd?: string
  [key: string]: unknown
}

export default async function findGithubIssue (workingKnowledge: WorkingKnowledge): Promise<WorkingKnowledge> {
  const { dryrunEnabled, ticket, ticketTitle, cwd } = workingKnowledge
  const report = reportFactory({ dryrunEnabled: !!dryrunEnabled, stepPrefix: '[FindGithubIssue]' })

  let issueTitle: string | undefined, issueUrl: string | undefined, ticketUrl: string | undefined
  const ticketStr = typeof ticket === 'string' ? ticket : ''
  const issueNumber = Number.parseInt(ticketStr.split('/')[0].replace('#', ''))
  if (isNumeric(issueNumber)) {
    const { stdout, stderr } = await exec(`hub issue show ${issueNumber} -f "%t-|@|-%U"`)

    if (typeof stderr === 'string' && stderr.length > 0) {
      report(`No github issue found: ${stderr}`)
    } else if (typeof stdout === 'string' && stdout.length > 0) {
      [issueTitle, issueUrl] = stdout.trim().split('-|@|-')
      ticket = '#' + String(issueNumber)
      if (typeof ticketTitle !== 'string' || ticketTitle === '') {
        ticketTitle = issueTitle
      }
      ticketUrl = issueUrl
      report(`Using: ${ticket ?? ''} ${ticketTitle ?? ''} ${ticketUrl ?? ''}`)
    }
  }

  return Object.assign({}, workingKnowledge, {
    ticket,
    ticketTitle,
    ticketUrl,
    cwd
  })
}
