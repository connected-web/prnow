import { reportFactory } from '../util/report'
import exec from '../util/asyncExec'

export interface WorkingKnowledge {
  ticket?: string
  ticketTitle?: string
  ticketUrl?: string
  cwd?: string
  defaultBranchName?: string
  dryrunEnabled?: boolean
  [key: string]: unknown
}

export default async function findDefaultBranch (workingKnowledge: WorkingKnowledge): Promise<WorkingKnowledge> {
  const { dryrunEnabled, ticket, ticketTitle, ticketUrl, cwd } = workingKnowledge
  const report = reportFactory({ dryrunEnabled, stepPrefix: '[FindDefaultBranch]' })
  // - Find the default branch for this repo

  let defaultBranchName = 'main'

  try {
    const originInformation = (await exec('git remote show origin', { cwd })).stdout
    const headLine = originInformation.split('\n').find(n => typeof n === 'string' && String(n).includes('HEAD branch'))
    if (typeof headLine === 'string') {
      defaultBranchName = headLine.trim().split(':')[1]?.trim() ?? 'main'
      report(`Found: ${String(defaultBranchName)}`)
    }
  } catch (ex: any) {
    report(`Unable to discern default branch name from origin: ${String(ex.message)}`)
  }

  return Object.assign({}, workingKnowledge, {
    ticket,
    ticketTitle,
    ticketUrl,
    defaultBranchName,
    cwd
  })
}
