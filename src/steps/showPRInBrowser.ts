import { reportFactory } from '../util/report'
import { getToken, TOKENS } from '../lang/tokens'
import exec from '../util/asyncExec'

export interface WorkingKnowledge {
  ticket?: string
  cwd?: string
  dryrunEnabled?: boolean
  [key: string]: unknown
}

export default async function showPRInBrowser (workingKnowledge: WorkingKnowledge): Promise<WorkingKnowledge> {
  const { dryrunEnabled, ticket, cwd } = workingKnowledge
  const report = reportFactory({ dryrunEnabled: !!dryrunEnabled, stepPrefix: '[ShowPRInBrowser]' })
  // Use `gh` to open a browser with the new PR so you can review and share with friends

  const ghShowCmd = 'gh pr view --web'
  if (dryrunEnabled === true) {
    report(`${getToken(TOKENS.DRY_RUN)} Would run: ${ghShowCmd}`)
  } else {
    const ghShowPR = await exec(ghShowCmd, { cwd })
    report(`gh: ${ghShowPR.stdout ?? ''} ${ghShowPR.stderr ?? ''}`)
  }

  return Object.assign({}, workingKnowledge, {
    ticket,
    cwd
  })
}
