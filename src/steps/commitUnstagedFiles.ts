import exec from '../util/asyncExec'
import dedupe from '../util/dedupe'
const report = (...messages: any[]) => console.log('[PR Now] [Commit Unstaged Files]', ...messages)

export interface WorkingKnowledge {
  ticket?: string
  ticketTitle?: string
  ticketUrl?: string
  branchName?: string
  cwd?: string
  [key: string]: any
}

export default async function commitUnstagedFiles (workingKnowledge: WorkingKnowledge): Promise<WorkingKnowledge> {
  const { ticket, ticketTitle, ticketUrl, branchName, cwd } = workingKnowledge
  // - Commit any unstaged files with the equivalent message "TICK-24 Title of ticket"

  const gitAdd = await exec('git add .', { cwd })
  report(gitAdd.stdout, gitAdd.stderr)

  const message = [
    dedupe(`${ticket} ${ticketTitle}`),
    ticketUrl ? `See: ${ticketUrl}` : ''
  ]
    .filter(n => n)
    .map(n => n.replace(/["]/g, '\\"'))
    .join('\n')

  try {
    const gitCommit = await exec(`git commit -m "${message}"`)
    report(gitCommit.stdout, gitCommit.stderr)
  } catch (ex: any) {
    report('Unable to complete git commmit. Continuing...', ex.message)
  }

  return Object.assign({}, workingKnowledge, {
    ticket,
    ticketTitle,
    ticketUrl,
    branchName,
    cwd
  })
}
