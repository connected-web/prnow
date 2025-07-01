const report = (...messages: unknown[]): void => console.log('[PR Now] [Create Title from Arguments]', ...messages)

export interface WorkingKnowledge {
  ticket?: string
  args?: string[]
  cwd?: string
  [key: string]: unknown
}

export default async function createTitleFromArguments (workingKnowledge: WorkingKnowledge): Promise<WorkingKnowledge> {
  let { ticket, args, cwd } = workingKnowledge
  args = Array.isArray(args) ? args : []

  // Only extract ticket from args if ticket is not already set and valid
  let ticketFromArgs: string | undefined = undefined
  if (typeof ticket !== 'string' || ticket.trim() === '') {
    if (args.length > 0 && typeof args[0] === 'string' && args[0].trim() !== '' && !args[0].startsWith('--')) {
      ticketFromArgs = args[0]
      args = args.slice(1)
    }
  }
  // Use the ticket from workingKnowledge if present, otherwise from args
  const finalTicket = (typeof ticket === 'string' && ticket.trim() !== '') ? ticket : ticketFromArgs

  let ticketTitle: string | undefined

  // Remove preview/dry-run flags from args before building title
  const filteredArgs = args.filter(arg => arg !== '--preview' && arg !== '--dry-run')

  const words = [finalTicket].concat(filteredArgs).join(' ').split(/[.\s+]/)
    .filter(n => typeof n === 'string' && n.length > 0)
    .filter(n => n !== '-m')

  if (words.length === 1) {
    ticketTitle = ''
  } else {
    ticketTitle = words.slice(1).join(' ')
    report('Using:', `"${words[0]}"`, 'as the ticket reference, and', `"${ticketTitle}"`, 'as the title')
  }

  return Object.assign({}, workingKnowledge, {
    ticket: words[0],
    ticketTitle,
    cwd
  })
}
