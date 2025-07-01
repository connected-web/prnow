import exec from '../util/asyncExec'
const report = (...messages: unknown[]): void => console.log('[PR Now] [Reset to default branch]', ...messages)

export interface WorkingKnowledge {
  cwd?: string
  defaultBranchName?: string
  [key: string]: unknown
}

export default async function resetGitToDefaultBranch (workingKnowledge: WorkingKnowledge): Promise<WorkingKnowledge> {
  const { cwd, defaultBranchName } = workingKnowledge
  // Checkout default branch, then pull and rebase

  const gitCheckoutDefault = await exec(`git checkout ${typeof defaultBranchName === 'string' ? defaultBranchName : ''}`, { cwd })
  report('git checkout:', gitCheckoutDefault.stdout, gitCheckoutDefault.stderr)

  const gitPullAndRebase = await exec('git pull -r', { cwd })
  report('git pull:', gitPullAndRebase.stdout, gitPullAndRebase.stderr)

  return Object.assign({}, workingKnowledge, {
    cwd
  })
}
