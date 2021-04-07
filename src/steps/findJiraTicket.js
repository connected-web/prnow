const fetch = require('../util/asyncFetch')
const createBranchNameSlug = require('../util/createBranchNameSlug')
const report = (...messages) => console.log('[PR Now] [Find Jira Ticket]', ...messages)

function tryParse (body) {
  let result = {}
  try {
    result = JSON.parse(body)
  } catch (ex) {
    report('Unable to parse', body, ex.message)
  }
  return result
}

async function findJiraTicket ({ ticket, branchName, ticketTitle, ticketUrl, cwd }) {
  // - Find *TICK-24* to see if there is a matching ticket to extract a title for a PR
  if (!ticket) {
    throw new Error(`No ticket reference found (${ticket}); prnow needs a reference to create a branch name`)
  }

  const { PRNOW_JIRA_BASE_URL, PRNOW_JIRA_CLIENT_KEY, PRNOW_JIRA_API_KEY } = process.env

  if (!PRNOW_JIRA_BASE_URL) {
    // Skiping this check
  } else {
    const jiraTicketId = ticket.split('/')[0]

    if (!ticketTitle) {
      const certFilePath = PRNOW_JIRA_CLIENT_KEY
      let ticketInfo
      if (!certFilePath && !PRNOW_JIRA_API_KEY) {
        report('Warning', 'No CLIENT_KEY environment variable set - unable to establish secure connection to Jira')
      } else {
        const rawResponse = await fetch({ url: `${PRNOW_JIRA_BASE_URL}/rest/api/latest/issue/${jiraTicketId}`, certFilePath, apiKey: PRNOW_JIRA_API_KEY })
        const parsedResponse = tryParse(rawResponse)

        if (!parsedResponse.errorMessages) {
          ticketInfo = parsedResponse
          ticketTitle = ticketInfo.fields.summary
          ticketUrl = `${PRNOW_JIRA_BASE_URL}/browse/${jiraTicketId}`
          ticket = jiraTicketId
          branchName = `${ticket}/${createBranchNameSlug(ticketTitle)}`
          report('Found', ticket, `"${ticketTitle}"`)
        }
      }
    }
  }

  return {
    ticket,
    branchName,
    ticketTitle,
    ticketUrl,
    cwd
  }
}

module.exports = findJiraTicket
