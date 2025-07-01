import { getToken, TOKENS } from '../lang/tokens'
import exec from '../util/asyncExec'
import dedupe from '../util/dedupe'
import { reportFactory } from '../util/report'
const report = (...messages: unknown[]): void => console.log('[PR Now] [Create a Github PR]', ...messages)

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
  const { ticket, ticketTitle, ticketUrl, cwd, defaultBranchName, dryrunEnabled } = workingKnowledge
  const report = reportFactory({ dryrunEnabled: !!dryrunEnabled, stepPrefix: '[CreateAGithubPR]' })
  // Use `gh` to create a PR in github with a title, and a link to the ticket in the description

  const title = dedupe(`${typeof ticket === 'string' ? ticket : ''} ${typeof ticketTitle === 'string' ? ticketTitle : ''}`)
  const body = (typeof ticketUrl === 'string' && ticketUrl !== '') ? `See: ${ticketUrl}` : 'There is no ticket for this work.'
  const ghCmd = `gh pr create --base ${typeof defaultBranchName === 'string' ? defaultBranchName : ''} --title "${title}" --body "${body}" --web --fill`

  if (dryrunEnabled === true) {
    report(`${getToken(TOKENS.DRY_RUN)} Would run: ${ghCmd}`)
  } else {
    try {
      const draftGhPR = await exec(ghCmd, { cwd })
      report('gh:', draftGhPR.stdout, draftGhPR.stderr)
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
