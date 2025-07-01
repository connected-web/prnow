import modes from './modes/_index'
const report = (...messages: any[]) => console.log('[PR Now]', ...messages)

export interface RunOptions {
  command: string
  args: string[]
  cwd: string
  preview?: boolean
}

export async function run ({ command, args, cwd, preview }: RunOptions): Promise<void> {
  const lcCommand = (command + '').toLowerCase()
  const mode = (modes as any)[lcCommand] || (modes as any).default
  let workingKnowledge = mode.setup({ command, args, cwd, preview })

  const previewFlag = preview ? ' [PREVIEW]' : ''
  report(mode.name, previewFlag)
  for (const [, stepFn] of Object.entries(mode.steps)) {
    if (typeof stepFn === 'function') {
      workingKnowledge = await stepFn(workingKnowledge)
    } else {
      report('Step is not a function:', stepFn)
    }
  }
}
