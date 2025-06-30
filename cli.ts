#!/usr/bin/env tsx
import * as index from './src/prnow'
const report = (...messages: any[]) => console.log('[PR Now] [CLI]', ...messages)

function hasPreviewFlag(args: string[]): boolean {
  return args.includes('--preview') || args.includes('--dry-run')
}

async function run () {
  const [,, command, ...args] = process.argv
  const cwd = process.cwd()
  const preview = hasPreviewFlag(args)
  const filteredArgs = args.filter(arg => arg !== '--preview' && arg !== '--dry-run')

  try {
    await index.run({ command, args: filteredArgs, cwd, preview })
  } catch (ex: any) {
    report('Unable to complete;', ex.message, ex)
  }
}

run()
