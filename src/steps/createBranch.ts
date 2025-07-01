import { getToken, TOKENS } from '../lang/tokens'
import exec from '../util/asyncExec'
import createBranchNameSlug from '../util/createBranchNameSlug'
const report = (...messages: unknown[]): void => console.log('[PR Now] [Create Branch]', ...messages)

const LEGACY_PATH_SEPARATOR = '/'
const BRANCH_PATH_SEPARATOR = '.'

export interface WorkingKnowledge {
  ticket?: string
  ticketTitle?: string
  ticketUrl?: string
  branchName?: string
  cwd?: string
  [key: string]: unknown
}

async function alreadyOnBranch ({ branchName, report }: { branchName: string, report: (...args: unknown[]) => void }): Promise<void> {
  report(`Already on branch ${String(branchName)}`)
}

async function switchToNewBranchFormat ({ branchName, report }: { branchName: string, report: (...args: unknown[]) => void }): Promise<void> {
  report('Switching to new branch format:', branchName)
}

async function reusingExistingBranch ({ branchName, report }: { branchName: string, report: (...args: unknown[]) => void }): Promise<void> {
  report('Reusing existing branch:', branchName)
}

async function checkoutNewBranch ({ branchName, report, cwd, dryrunEnabled }: { branchName: string, report: (...args: unknown[]) => void, cwd: string, dryrunEnabled: boolean }): Promise<void> {
  if (dryrunEnabled) {
    report(`${getToken(TOKENS.DRY_RUN)} Would run: git checkout -b "${String(branchName)}"`)
    return
  }
  report('Checking out new branch:', branchName)
  const { stdout, stderr } = await exec(`git checkout -b "${String(branchName)}"`, { cwd })
  report('git checkout:', stdout, stderr)
}

function notEmpty (value: string | undefined): value is string {
  return typeof value === 'string' && value.length > 0
}

export default async function createBranch (workingKnowledge: WorkingKnowledge): Promise<WorkingKnowledge> {
  const { ticket, ticketTitle, ticketUrl, cwd, dryrunEnabled } = workingKnowledge
  // - Create a branch equivalent to the ticket name

  const currentBranchName = (await exec('git branch', { cwd })).stdout.split('\n').filter(n => typeof n === 'string' && n.includes('* '))[0]?.substr(2) ?? ''
  report('Current Branch Name', currentBranchName)

  const legacyBranchName = [ticket, ticketTitle].map(x => typeof x === 'string' ? x : '').join(LEGACY_PATH_SEPARATOR)
  const extendedBranchName = [ticket, ticketTitle].map(x => typeof x === 'string' ? x : '').join(BRANCH_PATH_SEPARATOR)
  // Only add preview/dry-run to branch name if not already present
  // Avoid duplicating ticket/title in branch name
  let branchName = typeof ticket === 'string' && ticket.length > 0 ? ticket : ''
  if (typeof ticketTitle === 'string' && ticketTitle.length > 0) {
    const titleSlug = createBranchNameSlug(ticketTitle)
    // Only add titleSlug if not already in branchName
    if (!branchName.includes(titleSlug)) {
      branchName = [branchName, titleSlug].filter(Boolean).join(BRANCH_PATH_SEPARATOR)
    }
  }
  if (typeof branchName === 'string' && branchName !== '' && typeof dryrunEnabled === 'boolean' && dryrunEnabled && (branchName.endsWith('--preview') || branchName.endsWith('--dry-run'))) {
    // Remove accidental preview/dry-run suffix
    branchName = branchName.replace(/(--preview|--dry-run)$/, '')
  }

  const checkForExactMatch = branchName
  const checkForLegacyTicket = legacyBranchName
  const checkForExtendedTicket = extendedBranchName

  const outcomes: { [key: string]: (...args: any[]) => Promise<void> } = {}
  if (notEmpty(checkForExactMatch)) outcomes[checkForExactMatch] = alreadyOnBranch
  if (notEmpty(checkForLegacyTicket)) outcomes[checkForLegacyTicket] = switchToNewBranchFormat
  if (notEmpty(checkForExtendedTicket)) outcomes[checkForExtendedTicket] = reusingExistingBranch
  outcomes.default = checkoutNewBranch

  const action = typeof outcomes[currentBranchName] === 'function' ? outcomes[currentBranchName] : outcomes.default
  await action({ branchName, report, cwd, dryrunEnabled })

  return Object.assign({}, workingKnowledge, {
    ticket,
    ticketTitle,
    ticketUrl,
    branchName,
    cwd
  })
}
