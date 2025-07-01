import { getToken, TOKENS } from '../lang/tokens'
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
  const { dryrunEnabled, cwd } = workingKnowledge
  const ticket = typeof workingKnowledge.ticket === 'string' ? workingKnowledge.ticket : ''
  const ticketTitle = typeof workingKnowledge.ticketTitle === 'string' ? workingKnowledge.ticketTitle : ''
  const ticketUrl = typeof workingKnowledge.ticketUrl === 'string' ? workingKnowledge.ticketUrl : ''
  const branchName = typeof workingKnowledge.branchName === 'string' ? workingKnowledge.branchName : ''

  if (dryrunEnabled === true) {
    console.log(`${getToken(TOKENS.DRY_RUN)} Would run: git push`)
    console.log(`${getToken(TOKENS.DRY_RUN)} Would run: git push --set-upstream origin "${branchName}" (if no upstream branch)`)
  } else {
    try {
      const pushToRemote = await exec('git push', { cwd })
      console.log(`git push: ${pushToRemote.stdout ?? ''} ${pushToRemote.stderr ?? ''}`)
    } catch (ex: any) {
      if (typeof ex.message === 'string' && /no upstream branch/.test(ex.message)) {
        const pushToUpstream = await exec(`git push --set-upstream origin "${branchName}"`, { cwd })
        console.log(`git push: ${typeof pushToUpstream.stdout === 'string' ? pushToUpstream.stdout : ''} ${typeof pushToUpstream.stderr === 'string' ? pushToUpstream.stderr : ''}`)
      } else if (typeof ex.message === 'string' && /non-fast-forward/.test(ex.message)) {
        console.log('Push failed: Your branch is behind its remote counterpart. Please run `git pull --rebase` and try again.')
      } else {
        console.log(`Push failed: ${String(ex.message)}`)
      }
    }
  }

  return Object.assign({}, workingKnowledge, {
    ticket,
    ticketTitle,
    ticketUrl,
    branchName,
    cwd
  })
}
