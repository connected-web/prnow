import exec from '../util/asyncExec'
const report = (...messages: unknown[]): void => console.log('[PR Now] [Find Branch Name]', ...messages)

export interface WorkingKnowledge {
  ticket?: string
  ticketTitle?: string
  defaultBranchName?: string
  cwd?: string
  [key: string]: unknown
}

export default async function findTicketFromBranchName (workingKnowledge: WorkingKnowledge): Promise<WorkingKnowledge> {
  let { ticket, ticketTitle, defaultBranchName, cwd } = workingKnowledge
  // - Find branch name using `git rev-parse --abbrev-ref HEAD`, then use that as the ticket reference

  const { stdout, stderr } = await exec('git rev-parse --abbrev-ref HEAD', { cwd })
  report('Asked git for the current branch name:', stdout, stderr)
  const branchName = (typeof stderr === 'string' && stderr.length === 0) ? stdout : false
  const possibleTicket = typeof branchName === 'string' && branchName.length > 0 ? branchName.split('/')[0] : undefined

  if (typeof branchName === 'string' && branchName === defaultBranchName) {
    if (typeof ticket === 'string' && ticket.length > 0) {
      report('Using the provided ticket:', ticket, 'as the ticket reference')
    } else {
      throw new Error(`No ticket id provided, and git is currently on ${String(defaultBranchName)}. Please provide more information to prnow, such as a ticket ID, or a commit message.`)
    }
  } else {
    if (typeof ticket === 'string' && ticket === possibleTicket) {
      report('Supplied ticket reference seems to match current branch')
    } else {
      report('Already on a branch:', branchName, 'using', possibleTicket, 'as the ticket reference')
      ticket = possibleTicket
    }
  }

  return Object.assign({}, workingKnowledge, {
    ticket,
    ticketTitle,
    cwd
  })
}
