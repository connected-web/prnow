import exec from '../util/asyncExec'
import dedupe from '../util/dedupe'
const report = (...messages: any[]) => console.log('[PR Now] [Create a Github PR]', ...messages)

export interface WorkingKnowledge {
  ticket?: string
  ticketTitle?: string
  ticketUrl?: string
  cwd?: string
  defaultBranchName?: string
  [key: string]: any
}

export default async function createAGithubPR (workingKnowledge: WorkingKnowledge): Promise<WorkingKnowledge> {
  const { ticket, ticketTitle, ticketUrl, cwd, defaultBranchName } = workingKnowledge
  // - Use `hub` to create a PR in github with a title, and a link to the ticket in the description

  const messages = [
    dedupe(`${ticket} ${ticketTitle}`),
    ticketUrl ? `See: ${ticketUrl}` : 'There is no ticket for this work.'
  ]
    .filter(n => n)
    .map(n => n.replace(/["]/g, '\\"'))
    .map(m => `-m "${m}"`).join(' ')

  try {
    const draftHubPR = await exec(`hub pull-request -b ${defaultBranchName} -f --browse --no-edit ${messages}`, { cwd })
    report('Hub:', draftHubPR.stdout, draftHubPR.stderr)
  } catch (ex: any) {
    if (/A pull request already exists/.test(ex.message)) {
      report(ex.message)
    } else {
      throw ex
    }
  }

  return Object.assign({}, workingKnowledge, {
    ticket,
    cwd
  })
}
