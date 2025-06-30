import exec from '../util/asyncExec'
const report = (...messages: any[]) => console.log('[PR Now] [Show PR in Browser]', ...messages)

export interface WorkingKnowledge {
  ticket?: string
  cwd?: string
  [key: string]: any
}

export default async function showPRInBrowser (workingKnowledge: WorkingKnowledge): Promise<WorkingKnowledge> {
  const { ticket, cwd } = workingKnowledge
  // - Use `hub` to open a browser with the new PR so you can review and share with friends

  const hubShowPR = await exec('hub pr show', { cwd })
  report('hub:', hubShowPR.stdout, hubShowPR.stderr)

  return Object.assign({}, workingKnowledge, {
    ticket,
    cwd
  })
}
