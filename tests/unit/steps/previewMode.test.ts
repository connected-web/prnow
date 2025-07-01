import { expect } from 'chai'
import sinon from 'sinon'
import commitUnstagedFiles from '../../../src/steps/commitUnstagedFiles'
import pushToRemote from '../../../src/steps/pushToRemote'
import createAGithubPR from '../../../src/steps/createAGithubPR'

describe('Preview/Dry-Run Mode', () => {
  let consoleLogStub: sinon.SinonStub

  beforeEach(() => {
    consoleLogStub = sinon.stub(console, 'log')
  })

  afterEach(() => {
    consoleLogStub.restore()
  })

  it('should log dryrunEnabled messages for commitUnstagedFiles', async () => {
    await commitUnstagedFiles({ dryrunEnabled: true })
    const logCalls = consoleLogStub.getCalls().map(call => call.args.join(' ')).join('\n')
    expect(logCalls).to.include('[💦] [PR Now] [Commit unstaged files] Would run: git add .')
    expect(logCalls).to.include('[💦] [PR Now] [Commit unstaged files] Would run: git commit -m')
  })

  it('should log dryrunEnabled messages for pushToRemote', async () => {
    await pushToRemote({ dryrunEnabled: true, branchName: 'test-branch' })
    const logCalls = consoleLogStub.getCalls().map(call => call.args.join(' ')).join('\n')
    expect(logCalls).to.include('[💦] [PR Now] [Push to remote] Would run: git push')
    expect(logCalls).to.include('[💦] [PR Now] [Push to remote] Would run: git push --set-upstream origin "test-branch" (if no upstream branch)')
  })

  it('should log dryrunEnabled messages for createAGithubPR', async () => {
    await createAGithubPR({ dryrunEnabled: true, defaultBranchName: 'main' })
    const logCalls = consoleLogStub.getCalls().map(call => call.args.join(' ')).join('\n')
    expect(logCalls).to.include('[💦] [PR Now] [Create a GitHub PR] Would run: gh pr create --base main --title "" --body "There is no ticket for this work." --web --fill')
  })
})
