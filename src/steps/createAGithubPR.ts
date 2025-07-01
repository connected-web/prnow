import exec from '../util/asyncExec'
import dedupe from '../util/dedupe'
const report = (...messages: any[]) => console.log('[PR Now] [Create a Github PR]', ...messages)

export interface WorkingKnowledge {
  ticket?: string
  ticketTitle?: string
  ticketUrl?: string
  cwd?: string
  defaultBranchName?: string
  dryrunEnabled?: boolean
  [key: string]: any
}

export default async function createAGithubPR (workingKnowledge: WorkingKnowledge): Promise<WorkingKnowledge> {
  const { ticket, ticketTitle, ticketUrl, cwd, defaultBranchName, dryrunEnabled } = workingKnowledge
  // Use `gh` to create a PR in github with a title, and a link to the ticket in the description

  const title = dedupe(`${ticket} ${ticketTitle}`)
  const body = ticketUrl ? `See: ${ticketUrl}` : 'There is no ticket for this work.'
  const ghCmd = `gh pr create --base ${defaultBranchName} --title "${title}" --body "${body}" --web --fill`

  if (dryrunEnabled) {
    report(`[DRY RUN] Would run: ${ghCmd}`)
  } else {
    try {
      const draftGhPR = await exec(ghCmd, { cwd })
      report('gh:', draftGhPR.stdout, draftGhPR.stderr)
    } catch (ex: any) {
      if (/A pull request already exists/.test(ex.message)) {
        report(ex.message)
      } else {
        throw ex
      }
    }
  }

  return Object.assign({}, workingKnowledge, {
    ticket,
    cwd
  })
}
