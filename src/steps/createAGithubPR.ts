import exec from '../util/asyncExec'
import dedupe from '../util/dedupe'
import { reportFactory } from '../util/report'

export interface WorkingKnowledge {
  ticket?: string
  ticketTitle?: string
  ticketUrl?: string
  cwd?: string
  defaultBranchName?: string
  dryrunEnabled?: boolean
  [key: string]: unknown
}

export default async function createAGithubPR (workingKnowledge: WorkingKnowledge): Promise<WorkingKnowledge> {
  const { cwd, defaultBranchName, dryrunEnabled } = workingKnowledge
  const ticket = typeof workingKnowledge.ticket === 'string' ? workingKnowledge.ticket : ''
  const ticketTitle = typeof workingKnowledge.ticketTitle === 'string' ? workingKnowledge.ticketTitle : ''
  const ticketUrl = typeof workingKnowledge.ticketUrl === 'string' ? workingKnowledge.ticketUrl : ''
  const report = reportFactory({ dryrunEnabled, stepPrefix: '[Create a Github PR]' })
  // Use `gh` to create a PR in github with a title, and a link to the ticket in the description

  const title = dedupe(`${ticket} ${ticketTitle}`)
  const body = ticketUrl !== '' ? `See: ${ticketUrl}` : 'There is no ticket for this work.'
  const baseBranch = typeof defaultBranchName === 'string' ? defaultBranchName : ''
  const ghCmd = `gh pr create --base ${baseBranch} --title "${title}" --body "${body}" --web --fill`

  if (dryrunEnabled === true) {
    report(`Would run: ${ghCmd}`)
  } else {
    try {
      const draftGhPR = await exec(ghCmd, { cwd })
      report('gh:', typeof draftGhPR.stdout === 'string' ? draftGhPR.stdout : '', typeof draftGhPR.stderr === 'string' ? draftGhPR.stderr : '')
    } catch (ex: any) {
      if (typeof ex.message === 'string' && /A pull request already exists/.test(ex.message)) {
        report(ex.message)
      } else {
        throw ex
      }
    }
  }

  return Object.assign({}, workingKnowledge, {
    ticket,
    ticketTitle,
    ticketUrl,
    cwd,
    defaultBranchName,
    dryrunEnabled
  })
}
