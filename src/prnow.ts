import { getToken, TOKENS } from './lang/tokens'
import modes from './modes/_index'
const report = (...messages: unknown[]): void => console.log('[PR Now]', ...messages)

export interface RunOptions {
  command: string
  args: string[]
  cwd: string
  dryrunEnabled?: boolean
}

interface InitialWorkingKnowledge {
  cwd?: string
  dryrunEnabled?: boolean
  [key: string]: unknown
}

export async function run ({ command, args, cwd, dryrunEnabled }: RunOptions): Promise<void> {
  const lcCommand = String(command).toLowerCase()
  const mode = (modes as Record<string, unknown>)[lcCommand] ?? (modes as Record<string, unknown>).default
  if (typeof mode !== 'object' || mode === null || typeof (mode as any).setup !== 'function' || typeof (mode as any).steps !== 'object') {
    report('Invalid mode:', mode)
    return
  }
  let workingKnowledge: InitialWorkingKnowledge = (mode as any).setup({ command, args, cwd, dryrunEnabled })

  const dryrunEnabledFlag = dryrunEnabled === true ? getToken(TOKENS.DRY_RUN) : ''
  report((mode as any).name, dryrunEnabledFlag)
  for (const [, stepFn] of Object.entries((mode as any).steps)) {
    if (typeof stepFn === 'function') {
      // eslint-disable-next-line no-await-in-loop
      workingKnowledge = await stepFn(workingKnowledge)
    } else {
      report('Step is not a function:', stepFn)
    }
  }
}
