const exec = require('../util/asyncExec')
const report = (...messages) => console.log('[PR Now] [Find Branch Name]', ...messages)

async function findTicketFromBranchName ({ ticket, ticketTitle, cwd }) {
  // - Find branch name using `git rev-parse --abbrev-ref HEAD`, then use that as the ticket reference

  const { stdout, stderr } = await exec('git rev-parse --abbrev-ref HEAD', { cwd })
  report('Asked git for the current branch name:', stdout, stderr)
  const branchName = !stderr ? stdout : false
  const possibleTicket = branchName.split('/')[0]

  if (branchName === 'master') {
    if (ticket) {
      report('Using the provided ticket:', ticket, 'as the ticket reference')
    } else {
      throw new Error('No ticket id provided, and git is currently on master. Please provide more information to prnow, such as a ticket ID, or a commit message.')
    }
  } else {
    if (ticket === possibleTicket) {
      report('Supplied ticket reference seems to match current branch')
    } else {
      report('Already on a branch:', branchName, 'using', possibleTicket, 'as the ticket reference')
      ticket = possibleTicket
    }
  }

  return {
    ticket,
    ticketTitle,
    cwd
  }
}

module.exports = findTicketFromBranchName
