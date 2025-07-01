import { reportFactory } from '../util/report'

export interface WorkingKnowledge {
  ticket?: string
  ticketTitle?: string
  ticketUrl?: string
  cwd?: string
  dryRunEnabled?: boolean
  [key: string]: unknown
}

export default async function applyDefaultsIfNeeded (workingKnowledge: WorkingKnowledge): Promise<WorkingKnowledge> {
  const dryrunEnabled = workingKnowledge.dryRunEnabled
  const report = reportFactory({ dryrunEnabled, stepPrefix: '[ApplyDefaultsIfNeeded]' })

  // Cast ticket and ticketTitle to string for type safety
  const ticketRaw: unknown = workingKnowledge.ticket
  const ticketStr: string = typeof ticketRaw === 'string' ? ticketRaw : ''
  let ticketTitleStr: string = typeof workingKnowledge.ticketTitle === 'string' ? workingKnowledge.ticketTitle : ''
  const ticketUrl = typeof workingKnowledge.ticketUrl === 'string' ? workingKnowledge.ticketUrl : undefined
  const cwd = typeof workingKnowledge.cwd === 'string' ? workingKnowledge.cwd : undefined

  // Apply a default title, and ticket url if not set by this point
  if (!(typeof ticketRaw === 'string' && ticketRaw.length > 0)) {
    throw new Error('No ticket reference found (' + String(workingKnowledge.ticket) + '); prnow needs a reference to create a branch name')
  }

  if (ticketTitleStr.length === 0) {
    ticketTitleStr = ticketStr + ' is feature complete'
    report('Using default ticket title: ' + ticketTitleStr)
  }

  return Object.assign({}, workingKnowledge, {
    ticket: ticketStr,
    ticketTitle: ticketTitleStr,
    ticketUrl,
    cwd
  })
}
