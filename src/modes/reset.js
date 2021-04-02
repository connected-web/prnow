const { resetGitToMain } = require('../steps/_index')

const resetMode = {
  name: 'Reset it Already!',
  setup: ({ command, args, cwd }) => {
    const workingKnowledge = {
      cwd
    }
    return workingKnowledge
  },
  steps: {
    'Reset to main': resetGitToMain
  }
}

module.exports = resetMode
