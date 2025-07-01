import { reportFactory } from '../util/report'
import exec from '../util/asyncExec'
import isNumeric from '../util/isNumeric'

export interface WorkingKnowledge {
  ticket?: string
  ticketTitle?: string
  ticketUrl?: string
  cwd?: string
  dryrunEnabled?: boolean
  [key: string]: unknown
}

export default async function findGithubIssue (workingKnowledge: WorkingKnowledge): Promise<WorkingKnowledge> {
  const { dryrunEnabled, cwd } = workingKnowledge
  let ticket = typeof workingKnowledge.ticket === 'string' ? workingKnowledge.ticket : ''
  let ticketTitle = typeof workingKnowledge.ticketTitle === 'string' ? workingKnowledge.ticketTitle : ''
  let ticketUrl = typeof workingKnowledge.ticketUrl === 'string' ? workingKnowledge.ticketUrl : ''
  const report = reportFactory({ dryrunEnabled, stepPrefix: '[Find GitHub issue]' })

  let issueTitle: string | undefined, issueUrl: string | undefined
  const ticketStr = ticket
  const issueNumber = Number.parseInt(ticketStr.split('/')[0].replace('#', ''))
  if (isNumeric(issueNumber)) {
    const { stdout, stderr } = await exec(`hub issue show ${issueNumber} -f "%t-|@|-%U"`)

    if (typeof stderr === 'string' && String(stderr).length > 0) {
      report(`No github issue found: ${String(stderr)}`)
    } else if (typeof stdout === 'string' && String(stdout).length > 0) {
      [issueTitle, issueUrl] = String(stdout).trim().split('-|@|-')
      ticket = '#' + String(issueNumber)
      if (ticketTitle === '') {
        ticketTitle = issueTitle ?? ''
      }
      ticketUrl = issueUrl ?? ''
      report(`Using: ${ticket} ${ticketTitle} ${ticketUrl}`)
    }
  }

  return Object.assign({}, workingKnowledge, {
    ticket,
    ticketTitle,
    ticketUrl,
    cwd
  })
}
