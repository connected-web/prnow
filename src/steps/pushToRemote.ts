import { reportFactory } from '../util/report'
import exec from '../util/asyncExec'

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
  const { dryrunEnabled, cwd, branchName } = workingKnowledge
  const report = reportFactory({ dryrunEnabled, stepPrefix: '[Push to remote]' })
  const ticket = typeof workingKnowledge.ticket === 'string' ? workingKnowledge.ticket : ''
  const ticketTitle = typeof workingKnowledge.ticketTitle === 'string' ? workingKnowledge.ticketTitle : ''
  const ticketUrl = typeof workingKnowledge.ticketUrl === 'string' ? workingKnowledge.ticketUrl : ''
  const branch = typeof branchName === 'string' ? branchName : ''

  if (dryrunEnabled === true) {
    report('Would run: git push')
    report(`Would run: git push --set-upstream origin "${branch}" (if no upstream branch)`)
  } else {
    try {
      const pushToRemote = await exec('git push', { cwd })
      report(`git push: ${pushToRemote.stdout ?? ''} ${pushToRemote.stderr ?? ''}`)
    } catch (ex: any) {
      if (typeof ex.message === 'string' && /no upstream branch/.test(ex.message)) {
        const pushToUpstream = await exec(`git push --set-upstream origin "${branch}"`, { cwd })
        report(`git push: ${typeof pushToUpstream.stdout === 'string' ? pushToUpstream.stdout : ''} ${typeof pushToUpstream.stderr === 'string' ? pushToUpstream.stderr : ''}`)
      } else if (typeof ex.message === 'string' && /non-fast-forward/.test(ex.message)) {
        report('Push failed: Your branch is behind its remote counterpart. Please run `git pull --rebase` and try again.')
      } else {
        report(`Push failed: ${String(ex.message)}`)
      }
    }
  }

  return Object.assign({}, workingKnowledge, {
    ticket,
    ticketTitle,
    ticketUrl,
    branchName: branch,
    cwd
  })
}
