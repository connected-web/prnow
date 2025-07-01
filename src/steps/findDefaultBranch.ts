import exec from '../util/asyncExec'
import { reportFactory } from '../util/report'
const report = (...messages: unknown[]): void => console.log('[PR Now] [Find Default Branch]', ...messages)

export interface WorkingKnowledge {
  ticket?: string
  ticketTitle?: string
  ticketUrl?: string
  cwd?: string
  defaultBranchName?: string
  [key: string]: unknown
}

export default async function findDefaultBranch (workingKnowledge: WorkingKnowledge): Promise<WorkingKnowledge> {
  const { dryrunEnabled } = workingKnowledge
  const report = reportFactory({ dryrunEnabled: !!dryrunEnabled, stepPrefix: '[FindDefaultBranch]' })
  const { ticket, ticketTitle, ticketUrl, cwd } = workingKnowledge
  // - Find the default branch for this repo

  let defaultBranchName = 'main'

  try {
    const originInformation = (await exec('git remote show origin', { cwd })).stdout
    const headLine = originInformation.split('\n').find(n => typeof n === 'string' && n.includes('HEAD branch'))
    if (typeof headLine === 'string') {
      defaultBranchName = headLine.trim().split(':')[1]?.trim() ?? 'main'
      report('Found:', defaultBranchName)
    }
  } catch (ex: any) {
    report('Unable to discern default branch name from origin:', ex.message)
  }

  return Object.assign({}, workingKnowledge, {
    ticket,
    ticketTitle,
    ticketUrl,
    defaultBranchName,
    cwd
  })
}
