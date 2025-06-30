import exec from '../util/asyncExec'
const report = (...messages: any[]) => console.log('[PR Now] [Find Default Branch]', ...messages)

export interface WorkingKnowledge {
  ticket?: string
  ticketTitle?: string
  ticketUrl?: string
  cwd?: string
  defaultBranchName?: string
  [key: string]: any
}

export default async function findDefaultBranch (workingKnowledge: WorkingKnowledge): Promise<WorkingKnowledge> {
  const { ticket, ticketTitle, ticketUrl, cwd } = workingKnowledge
  // - Find the default branch for this repo

  let defaultBranchName = 'main'

  try {
    const originInformation = (await exec('git remote show origin', { cwd })).stdout
    defaultBranchName = originInformation.split('\n').filter(n => n.includes('HEAD branch'))[0].trim().split(':')[1].trim()
    report('Found:', defaultBranchName)
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
