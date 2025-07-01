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
  let { ticket, branchName, ticketTitle, ticketUrl, cwd } = workingKnowledge
  // - Find *TICK-24* to see if there is a matching ticket to extract a title for a PR
  if (typeof ticket !== 'string' || ticket === '') {
    throw new Error(`No ticket reference found (${String(ticket)}); prnow needs a reference to create a branch name`)
  }

  const { PRNOW_JIRA_BASE_URL, PRNOW_JIRA_CLIENT_KEY, PRNOW_JIRA_API_KEY } = process.env

  if (typeof PRNOW_JIRA_BASE_URL !== 'string' || PRNOW_JIRA_BASE_URL === '') {
    // Skipping this check
  } else {
    const jiraTicketId = ticket.split('/')[0]

    if (typeof ticketTitle !== 'string' || ticketTitle === '') {
      const certFilePath = PRNOW_JIRA_CLIENT_KEY
      let ticketInfo: Record<string, unknown> | undefined
      if (typeof certFilePath !== 'string' || certFilePath === '') {
        report('Warning', 'No CLIENT_KEY environment variable set - unable to establish secure connection to Jira')
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
