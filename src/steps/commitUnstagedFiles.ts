import { reportFactory } from '../util/report'
import exec from '../util/asyncExec'
import dedupe from '../util/dedupe'

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
  const { dryrunEnabled, branchName, cwd } = workingKnowledge
  const report = reportFactory({ dryrunEnabled, stepPrefix: '[Commit unstaged files]' })
  const ticket = typeof workingKnowledge.ticket === 'string' ? workingKnowledge.ticket : ''
  const ticketTitle = typeof workingKnowledge.ticketTitle === 'string' ? workingKnowledge.ticketTitle : ''
  const ticketUrl = typeof workingKnowledge.ticketUrl === 'string' ? workingKnowledge.ticketUrl : ''
  const message = [
    dedupe(`${ticket} ${ticketTitle}`),
    ticketUrl !== '' ? `See: ${ticketUrl}` : ''
  ]
    .filter(n => typeof n === 'string' && n.length > 0)
    .map(n => n.replace(/"/g, '"'))
    .join('\n')

  if (dryrunEnabled !== undefined && dryrunEnabled) {
    report('Would run: git add .')
    report(`Would run: git commit -m "${message}"`)
  } else {
    const gitAdd = await exec('git add .', { cwd })
    report('git add: ' + String(gitAdd.stdout ?? '') + ' ' + String(gitAdd.stderr ?? ''))
    try {
      const { stdout: statusStdout } = await exec('git diff --cached --name-only', { cwd })
      if (typeof statusStdout !== 'string' || statusStdout === undefined || statusStdout === null || statusStdout.trim() === '') {
        report('No staged changes to commit.')
      } else {
        const gitCommit = await exec(`git commit -m "${message}"`, { cwd })
        report('git commit: ' + String(gitCommit.stdout ?? '') + ' ' + String(gitCommit.stderr ?? ''))
      }
    } catch (ex: any) {
      report('Unable to complete git commit. Continuing... ' + String(ex.message ?? ''))
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
