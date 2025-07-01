import { reportFactory } from '../util/report'
import fetch from '../util/asyncFetch'
const report = (...messages: unknown[]): void => console.log('[PR Now] [Find Jira Ticket]', ...messages)

function tryParse (body: string): Record<string, unknown> {
  let result: Record<string, unknown> = {}
  try {
    result = JSON.parse(body)
  } catch (ex: any) {
    report('Unable to parse', body, ex.message)
  }
  return result
}

export interface WorkingKnowledge {
  ticket?: string
  branchName?: string
  ticketTitle?: string
  ticketUrl?: string
  cwd?: string
  [key: string]: unknown
}

export default async function findJiraTicket (workingKnowledge: WorkingKnowledge): Promise<WorkingKnowledge> {
  const { dryrunEnabled, branchName, cwd } = workingKnowledge
  const ticket = typeof workingKnowledge.ticket === 'string' ? workingKnowledge.ticket : ''
  let ticketTitle = typeof workingKnowledge.ticketTitle === 'string' ? workingKnowledge.ticketTitle : ''
  const ticketUrl = typeof workingKnowledge.ticketUrl === 'string' ? workingKnowledge.ticketUrl : ''
  const report = reportFactory({ dryrunEnabled, stepPrefix: '[FindJiraTicket]' })

  if (typeof ticket !== 'string' || ticket === undefined || ticket === '') {
    throw new Error(`No ticket reference found (${String(workingKnowledge.ticket)}); prnow needs a reference to create a branch name`)
  }

  const { PRNOW_JIRA_BASE_URL, PRNOW_JIRA_CLIENT_KEY, PRNOW_JIRA_API_KEY } = process.env

  if (typeof PRNOW_JIRA_BASE_URL !== 'string' || PRNOW_JIRA_BASE_URL === '') {
    report('Jira integration skipped: PRNOW_JIRA_BASE_URL or CLIENT_KEY environment variable not set. Set these to enable Jira ticket lookups.')
  } else {
    const jiraTicketId = ticket.split('/')[0] ?? ''
    if (ticketTitle === '') {
      const certFilePath = PRNOW_JIRA_CLIENT_KEY
      let ticketInfo: Record<string, unknown> | undefined
      if (typeof certFilePath !== 'string' || certFilePath === '') {
        report('Warning: No CLIENT_KEY environment variable set - unable to establish secure connection to Jira')
      } else {
        const rawResponse = await fetch({ url: `${PRNOW_JIRA_BASE_URL}/rest/api/latest/issue/${jiraTicketId}`, certFilePath, apiKey: PRNOW_JIRA_API_KEY })
        const parsedResponse = tryParse(rawResponse)
        if (typeof parsedResponse === 'object' && parsedResponse !== null && !('errorMessages' in parsedResponse)) {
          ticketInfo = parsedResponse
          if (typeof ticketInfo === 'object' && ticketInfo !== null && 'fields' in ticketInfo && typeof (ticketInfo as any).fields === 'object' && (ticketInfo as any).fields !== null && 'summary' in (ticketInfo as any).fields) {
            ticketTitle = String((ticketInfo as any).fields.summary)
          }
        }
      }
    }
  }

  return Object.assign({}, workingKnowledge, {
    ticket,
    branchName,
    ticketTitle,
    ticketUrl,
    cwd
  })
}
