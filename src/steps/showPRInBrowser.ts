import exec from '../util/asyncExec'
const report = (...messages: any[]) => console.log('[PR Now] [Show PR in Browser]', ...messages)

export interface WorkingKnowledge {
  ticket?: string
  cwd?: string
  dryrunEnabled?: boolean
  [key: string]: any
}

export default async function showPRInBrowser (workingKnowledge: WorkingKnowledge): Promise<WorkingKnowledge> {
  const { ticket, cwd, dryrunEnabled } = workingKnowledge
  // Use `gh` to open a browser with the new PR so you can review and share with friends

  const ghShowCmd = 'gh pr view --web'
  if (dryrunEnabled) {
    report(`[DRY RUN] Would run: ${ghShowCmd}`)
  } else {
    const ghShowPR = await exec(ghShowCmd, { cwd })
    report('gh:', ghShowPR.stdout, ghShowPR.stderr)
  }

  return Object.assign({}, workingKnowledge, {
    ticket,
    cwd
  })
}
