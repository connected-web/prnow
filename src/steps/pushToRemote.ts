import exec from '../util/asyncExec'
const report = (...messages: any[]) => console.log('[PR Now] [Push to Remote]', ...messages)

export interface WorkingKnowledge {
  ticket?: string
  ticketTitle?: string
  ticketUrl?: string
  branchName?: string
  cwd?: string
  preview?: boolean
  [key: string]: any
}

export default async function pushToRemote (workingKnowledge: WorkingKnowledge): Promise<WorkingKnowledge> {
  const { ticket, ticketTitle, ticketUrl, branchName, cwd, preview } = workingKnowledge
  if (preview) {
    report(`[PREVIEW] Would run: git push`)
    report(`[PREVIEW] Would run: git push --set-upstream origin "${branchName}" (if no upstream branch)`)
  } else {
    try {
      const pushToRemote = await exec('git push', { cwd })
      report('git push:', pushToRemote.stdout, pushToRemote.stderr)
    } catch (ex: any) {
      if (/no upstream branch/.test(ex.message)) {
        const pushToUpstream = await exec(`git push --set-upstream origin "${branchName}"`, { cwd })
        report('git push:', pushToUpstream.stdout, pushToUpstream.stderr)
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
