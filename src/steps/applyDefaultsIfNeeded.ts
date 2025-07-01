import { reportFactory } from '../util/report'

const report = (...messages: unknown[]): void => console.log('[PR Now] [Apply Defaults if Needed]', ...messages)

export interface WorkingKnowledge {
  ticket?: string
  ticketTitle?: string
  ticketUrl?: string
  cwd?: string
  [key: string]: unknown
}

export default async function applyDefaultsIfNeeded (workingKnowledge: WorkingKnowledge): Promise<WorkingKnowledge> {
  const { dryrunEnabled } = workingKnowledge
  const report = reportFactory({ dryrunEnabled: !!dryrunEnabled, stepPrefix: '[ApplyDefaultsIfNeeded]' })

  let { ticket, ticketTitle, ticketUrl, cwd } = workingKnowledge

  // Apply a default title, and ticket url if not set by this point
  if (typeof ticket !== 'string' || ticket === '') {
    throw new Error(`No ticket reference found (${String(ticket)}); prnow needs a reference to create a branch name`)
  }

  if (typeof ticketTitle !== 'string' || ticketTitle === '') {
    ticketTitle = ticket + ' is feature complete'
    ticketUrl = ''
    report('Using default ticket title:', ticketTitle)
  }

  return Object.assign({}, workingKnowledge, {
    ticket,
    ticketTitle,
    ticketUrl,
    cwd
  })
}
