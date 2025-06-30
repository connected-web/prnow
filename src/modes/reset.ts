import steps from '../steps/_index'

const { resetGitToDefaultBranch, findDefaultBranch } = steps

const resetMode = {
  name: 'Reset it Already!',
  setup: ({ command, args, cwd }: { command: string, args: string[], cwd: string }) => {
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

export default resetMode
