import { expect } from 'chai'
import createBranch from '../../../src/steps/createBranch'

describe('Create Branch Step', () => {
  it('should export the step as a function', () => {
    expect(typeof createBranch).to.equal('function')
  })
})
