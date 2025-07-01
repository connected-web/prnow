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
  const report = reportFactory({ dryrunEnabled, stepPrefix: '[ShowPRInBrowser]' })
  // Use `gh` to open a browser with the new PR so you can review and share with friends

  const ghShowCmd = 'gh pr view --web'
  if (dryrunEnabled === true) {
    report(`Would run: ${ghShowCmd}`)
  } else {
    const ghShowPR = await exec(ghShowCmd, { cwd })
    report(`gh: ${typeof ghShowPR.stdout === 'string' ? ghShowPR.stdout : ''} ${typeof ghShowPR.stderr === 'string' ? ghShowPR.stderr : ''}`)
  }

  return Object.assign({}, workingKnowledge, {
    ticket,
    cwd
  })
}
