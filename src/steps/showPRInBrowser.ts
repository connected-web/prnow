import { reportFactory } from '../util/report'
import exec from '../util/asyncExec'

export interface WorkingKnowledge {
  ticket?: string
  cwd?: string
  dryrunEnabled?: boolean
  [key: string]: unknown
}

export default async function showPRInBrowser (workingKnowledge: WorkingKnowledge): Promise<WorkingKnowledge> {
  const dryrunEnabled = workingKnowledge.dryrunEnabled
  const cwd = typeof workingKnowledge.cwd === 'string' ? workingKnowledge.cwd : undefined
  const ticket = typeof workingKnowledge.ticket === 'string' ? workingKnowledge.ticket : ''
  const report = reportFactory({ dryrunEnabled, stepPrefix: '[Show PR in browser]' })
  // Use `gh` to open a browser with the new PR so you can review and share with friends

  const ghShowCmd = 'gh pr view'
  const ghShowWebCmd = 'gh pr view --web'
  if (dryrunEnabled === true) {
    report(`Would run: ${ghShowWebCmd}`)
  } else {
    // First, check if a PR exists for this branch
    const ghShowPR = await exec(ghShowCmd, { cwd })
    if (ghShowPR.code === 0) {
      // PR exists, open in browser
      await exec(ghShowWebCmd, { cwd })
      report('Opened PR in browser.')
    } else {
      report('No pull request found for this branch. Please create a PR first.')
    }
  }

  return Object.assign({}, workingKnowledge, {
    ticket,
    cwd
  })
}
