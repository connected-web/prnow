#!/usr/bin/env node

const index = require('./')
const report = (...messages) => console.log('[PR Now] [CLI]', ...messages)

async function run () {
  const [,, command, ...args] = process.argv
  const cwd = process.cwd()

  try {
    await index.run({ command, args, cwd })
  } catch (ex) {
    report('Unable to complete;', ex.message, ex)
  }
}

run()
