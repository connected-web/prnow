import { getToken, TOKENS } from '../lang/tokens'
import exec from '../util/asyncExec'
import { reportFactory } from '../util/report'
const report = (...messages: unknown[]): void => console.log('[PR Now] [Push to Remote]', ...messages)

export interface WorkingKnowledge {
  ticket?: string
  ticketTitle?: string
  ticketUrl?: string
  branchName?: string
  cwd?: string
  dryrunEnabled?: boolean
  [key: string]: unknown
}

export default async function pushToRemote (workingKnowledge: WorkingKnowledge): Promise<WorkingKnowledge> {
  const { ticket, ticketTitle, ticketUrl, branchName, cwd, dryrunEnabled } = workingKnowledge
  const report = reportFactory({ dryrunEnabled: !!dryrunEnabled, stepPrefix: '[PushToRemote]' })

  if (dryrunEnabled === true) {
    report(`${getToken(TOKENS.DRY_RUN)} Would run: git push`)
    report(`${getToken(TOKENS.DRY_RUN)} Would run: git push --set-upstream origin "${typeof branchName === 'string' ? branchName : ''}" (if no upstream branch)`)
  } else {
    try {
      const pushToRemote = await exec('git push', { cwd })
      report('git push:', pushToRemote.stdout, pushToRemote.stderr)
    } catch (ex: any) {
      if (typeof ex.message === 'string' && /no upstream branch/.test(ex.message)) {
        const pushToUpstream = await exec(`git push --set-upstream origin "${typeof branchName === 'string' ? branchName : ''}"`, { cwd })
        report('git push:', pushToUpstream.stdout, pushToUpstream.stderr)
      } else if (typeof ex.message === 'string' && /non-fast-forward/.test(ex.message)) {
        report('Push failed: Your branch is behind its remote counterpart. Please run `git pull --rebase` and try again.')
      } else {
        report('Push failed:', ex.message)
      }
    }
  }

  return Object.assign({}, workingKnowledge, {
    ticket,
    ticketTitle,
    ticketUrl,
    cwd
  })
}
