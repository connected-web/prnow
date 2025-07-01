import { reportFactory } from '../util/report'
import exec from '../util/asyncExec'

export interface WorkingKnowledge {
  cwd?: string
  defaultBranchName?: string
  [key: string]: unknown
}

export default async function resetGitToDefaultBranch (workingKnowledge: WorkingKnowledge): Promise<WorkingKnowledge> {
  const { dryrunEnabled, cwd, defaultBranchName } = workingKnowledge
  const report = reportFactory({ dryrunEnabled, stepPrefix: '[ResetGitToDefaultBranch]' })

  const branch = typeof defaultBranchName === 'string' ? defaultBranchName : ''
  const gitCheckoutDefault = await exec(`git checkout ${branch}`, { cwd })
  report(`git checkout: ${typeof gitCheckoutDefault.stdout === 'string' ? gitCheckoutDefault.stdout : ''} ${typeof gitCheckoutDefault.stderr === 'string' ? gitCheckoutDefault.stderr : ''}`)

  const gitPullAndRebase = await exec('git pull -r', { cwd })
  report(`git pull: ${gitPullAndRebase.stdout ?? ''} ${gitPullAndRebase.stderr ?? ''}`)

  return Object.assign({}, workingKnowledge, {
    cwd
  })
}
