import modes from './modes/_index'
const report = (...messages: any[]) => console.log('[PR Now]', ...messages)

export interface RunOptions {
  command: string
  args: string[]
  cwd: string
  dryrunEnabled?: boolean
}

type InitialWorkingKnowledge = {
  cwd?: string
  dryrunEnabled?: boolean
  [key: string]: any
}

export async function run ({ command, args, cwd, dryrunEnabled }: RunOptions): Promise<void> {
  const lcCommand = (command + '').toLowerCase()
  const mode = (modes as any)[lcCommand] || (modes as any).default
  let workingKnowledge: InitialWorkingKnowledge = mode.setup({ command, args, cwd, dryrunEnabled })

  const dryrunEnabledFlag = dryrunEnabled ? '[DRY RUN]' : ''
  report(mode.name, dryrunEnabledFlag)
  for (const [, stepFn] of Object.entries(mode.steps)) {
    if (typeof stepFn === 'function') {
      workingKnowledge = await stepFn(workingKnowledge)
    } else {
      report('Step is not a function:', stepFn)
    }
  }
}
