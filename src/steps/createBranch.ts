import exec from '../util/asyncExec'
import createBranchNameSlug from '../util/createBranchNameSlug'
const report = (...messages: any[]) => console.log('[PR Now] [Create Branch]', ...messages)

const LEGACY_PATH_SEPARATOR = '/'
const BRANCH_PATH_SEPARATOR = '.'

export interface WorkingKnowledge {
  ticket?: string
  ticketTitle?: string
  ticketUrl?: string
  branchName?: string
  cwd?: string
  [key: string]: any
}

async function alreadyOnBranch ({ branchName, report }: { branchName: string, report: Function }) {
  report(`Already on branch ${branchName}`)
}

async function switchToNewBranchFormat ({ branchName, report }: { branchName: string, report: Function }) {
  report('Switching to new branch format:', branchName)
}

async function reusingExistingBranch ({ branchName, report }: { branchName: string, report: Function }) {
  report('Reusing existing branch:', branchName)
}

async function checkoutNewBranch ({ branchName, report, cwd, dryrunEnabled }: { branchName: string, report: Function, cwd: string, dryrunEnabled: boolean }) {
  if (dryrunEnabled) {
    report(`[DRY RUN] Would run: git checkout -b "${branchName}"`)
    return
  }
  report('Checking out new branch:', branchName)
  const { stdout, stderr } = await exec(`git checkout -b "${branchName}"`, { cwd })
  report('git checkout:', stdout, stderr)
}

export default async function createBranch (workingKnowledge: WorkingKnowledge): Promise<WorkingKnowledge> {
  const { ticket, ticketTitle, ticketUrl, cwd, dryrunEnabled } = workingKnowledge
  // - Create a branch equivalent to the ticket name

  const currentBranchName = (await exec('git branch', { cwd })).stdout.split('\n').filter(n => /\* /.test(n))[0].substr(2)
  report('Current Branch Name', currentBranchName)

  const titleSlug = createBranchNameSlug(ticketTitle ?? '')
  const legacyBranchName = [ticket, titleSlug].join(LEGACY_PATH_SEPARATOR)
  const extendedBranchName = [ticket, titleSlug].join(BRANCH_PATH_SEPARATOR)
  const branchName = ticketTitle ? extendedBranchName : ticket

  const checkForExactMatch = branchName
  const checkForLegacyTicket = legacyBranchName
  const checkForExtendedTicket = extendedBranchName

  const outcomes: { [key: string]: Function } = {}
  if (checkForExactMatch) outcomes[checkForExactMatch] = alreadyOnBranch
  if (checkForLegacyTicket) outcomes[checkForLegacyTicket] = switchToNewBranchFormat
  if (checkForExtendedTicket) outcomes[checkForExtendedTicket] = reusingExistingBranch
  outcomes.default = checkoutNewBranch

  const action = outcomes[currentBranchName] || outcomes.default
  await action({ branchName, report, cwd, dryrunEnabled })

  return Object.assign({}, workingKnowledge, {
    ticket,
    ticketTitle,
    ticketUrl,
    branchName,
    cwd
  })
}
