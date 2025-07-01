#!/usr/bin/env tsx
import * as index from './src/prnow'
const report = (...messages: unknown[]): void => console.log('[PR Now] [CLI]', ...messages)

function hasPreviewFlag (args: string[]): boolean {
  return args.includes('--preview') || args.includes('--dry-run')
}

async function run (): Promise<void> {
  let [,, command, ...args] = process.argv
  const cwd = process.cwd()
  const dryrunEnabled = hasPreviewFlag([command, ...args])
  const filteredArgs = args.filter(arg => arg !== '--dryrunEnabled' && arg !== '--dry-run')

  if (typeof command === 'string' && command.startsWith('--')) {
    command = ''
  }

  try {
    await index.run({ command, args: filteredArgs, cwd, dryrunEnabled })
  } catch (ex: any) {
    report('Unable to complete;', ex.message, ex)
  }
}

void run()
