import { getToken, TOKENS } from '../lang/tokens'
import exec from '../util/asyncExec'
import dedupe from '../util/dedupe'
import { reportFactory } from '../util/report'
const report = (...messages: unknown[]): void => console.log('[PR Now] [Commit Unstaged Files]', ...messages)

export interface WorkingKnowledge {
  ticket?: string
  ticketTitle?: string
  ticketUrl?: string
  branchName?: string
  cwd?: string
  dryrunEnabled?: boolean
  [key: string]: unknown
}

export default async function commitUnstagedFiles (workingKnowledge: WorkingKnowledge): Promise<WorkingKnowledge> {
  const { ticket, ticketTitle, ticketUrl, branchName, cwd, dryrunEnabled } = workingKnowledge
  const report = reportFactory({ dryrunEnabled: !!dryrunEnabled, stepPrefix: '[CommitUnstagedFiles]' })
  // - Commit any unstaged files with the equivalent message "TICK-24 Title of ticket"

  const safeTicket = typeof ticket === 'string' ? ticket : ''
  const safeTitle = typeof ticketTitle === 'string' ? ticketTitle : ''
  const safeUrl = typeof ticketUrl === 'string' ? ticketUrl : ''
  const message = [
    dedupe(`${safeTicket} ${safeTitle}`),
    safeUrl !== '' ? `See: ${safeUrl}` : ''
  ]
    .filter(n => typeof n === 'string' && n.length > 0)
    .map(n => n.replace(/"/g, '"'))
    .join('\n')

  if (dryrunEnabled === true) {
    report(`${getToken(TOKENS.DRY_RUN)} Would run: git add .`)
    report(`${getToken(TOKENS.DRY_RUN)} Would run: git commit -m "${message}"`)
  } else {
    const gitAdd = await exec('git add .', { cwd })
    report(gitAdd.stdout, gitAdd.stderr)
    try {
      // Check if there are staged changes before committing
      const { stdout: statusStdout } = await exec('git diff --cached --name-only', { cwd })
      if (!statusStdout || statusStdout.trim() === '') {
        report('No staged changes to commit.')
      } else {
        const gitCommit = await exec(`git commit -m "${message}"`, { cwd })
        report(gitCommit.stdout, gitCommit.stderr)
      }
    } catch (ex: any) {
      report('Unable to complete git commmit. Continuing...', ex.message)
    }
  }
  return Object.assign({}, workingKnowledge, {
    ticket,
    ticketTitle,
    ticketUrl,
    branchName,
    cwd,
    dryrunEnabled
  })
}
