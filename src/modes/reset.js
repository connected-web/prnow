const { resetGitToDefaultBranch, findDefaultBranch } = require('../steps/_index')

const resetMode = {
  name: 'Reset it Already!',
  setup: ({ command, args, cwd }) => {
    const workingKnowledge = {
      cwd
    }
    return workingKnowledge
  },
  steps: {
    'Find default branch': findDefaultBranch,
    'Reset to default branch': resetGitToDefaultBranch
  }
}

module.exports = resetMode
