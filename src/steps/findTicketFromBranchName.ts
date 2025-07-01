import { reportFactory } from '../util/report'
import exec from '../util/asyncExec'

export interface WorkingKnowledge {
  ticket?: string
  ticketTitle?: string
  defaultBranchName?: string
  cwd?: string
  dryrunEnabled?: boolean
  [key: string]: unknown
}

export default async function findTicketFromBranchName (workingKnowledge: WorkingKnowledge): Promise<WorkingKnowledge> {
  const { dryrunEnabled, ticketTitle, defaultBranchName, cwd } = workingKnowledge
  let ticket = typeof workingKnowledge.ticket === 'string' ? workingKnowledge.ticket : ''
  const report = reportFactory({ dryrunEnabled, stepPrefix: '[Find Jira ticket]' })

  const { stdout, stderr } = await exec('git rev-parse --abbrev-ref HEAD', { cwd })
  report(`Asked git for the current branch name: ${stdout ?? ''} ${stderr ?? ''}`)
  const branchName = (typeof stderr === 'string' && stderr.length === 0) ? stdout : false

  // Extract ticket ID from branch name using regex (e.g., WORKOP-15)
  const ticketIdMatch = typeof branchName === 'string' ? branchName.match(/[A-Z]+-\d+/i) : null
  const possibleTicket = (ticketIdMatch != null) ? ticketIdMatch[0] : undefined

  if (typeof branchName === 'string' && branchName === defaultBranchName) {
    if (typeof ticket === 'string' && ticket.length > 0) {
      report(`Using the provided ticket: ${ticket} as the ticket reference`)
    } else {
      throw new Error(`No ticket id provided, and git is currently on ${String(defaultBranchName)}. Please provide more information to prnow, such as a ticket ID, or a commit message.`)
    }
  } else {
    if (typeof ticket === 'string' && ticket === possibleTicket) {
      report('Supplied ticket reference seems to match current branch')
    } else {
      report(`Already on a branch: ${typeof branchName === 'string' ? branchName : ''} using ${typeof possibleTicket === 'string' ? possibleTicket : ''} as the ticket reference`)
      ticket = typeof possibleTicket === 'string' ? possibleTicket : ''
    }
  }

  return Object.assign({}, workingKnowledge, {
    ticket,
    ticketTitle,
    cwd
  })
}
