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

  it('should log preview messages for commitUnstagedFiles', async () => {
    await commitUnstagedFiles({ preview: true })
    const logCalls = consoleLogStub.getCalls().map(call => call.args.join(' ')).join('\n')
    expect(logCalls).to.include('[PREVIEW] Would run: git add .')
    expect(logCalls).to.include('[PREVIEW] Would run: git commit -m')
  })

  it('should log preview messages for pushToRemote', async () => {
    await pushToRemote({ preview: true, branchName: 'test-branch' })
    const logCalls = consoleLogStub.getCalls().map(call => call.args.join(' ')).join('\n')
    expect(logCalls).to.include('[PREVIEW] Would run: git push')
    expect(logCalls).to.include('[PREVIEW] Would run: git push --set-upstream origin "test-branch"')
  })

  it('should log preview messages for createAGithubPR', async () => {
    await createAGithubPR({ preview: true, defaultBranchName: 'main' })
    const logCalls = consoleLogStub.getCalls().map(call => call.args.join(' ')).join('\n')
    expect(logCalls).to.include('[PREVIEW] Would run: hub pull-request -b main -f --browse --no-edit')
  })
})
