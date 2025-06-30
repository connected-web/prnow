#!/usr/bin/env node
import * as index from './src/prnow'
const report = (...messages: any[]) => console.log('[PR Now] [CLI]', ...messages)

async function run () {
  const [,, command, ...args] = process.argv
  const cwd = process.cwd()

  try {
    await index.run({ command, args, cwd })
  } catch (ex: any) {
    report('Unable to complete;', ex.message, ex)
  }
}

run()
