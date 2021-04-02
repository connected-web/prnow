const report = (...messages) => console.log('[PR Now]', ...messages)
const modes = require('./modes/_index')

async function run ({ command, args, cwd }) {
  const lcCommand = (command + '').toLowerCase()
  const mode = modes[lcCommand] || modes.default
  let workingKnowledge = mode.setup({ command, args, cwd })

  report(mode.name)
  for (const [, stepFn] of Object.entries(mode.steps)) {
    workingKnowledge = await stepFn(workingKnowledge)
  }
}

module.exports = {
  run
}
