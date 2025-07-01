// Centralized report/logging utility for prnow
// Usage: const report = reportFactory({ dryrunEnabled: true }); report('message')

export interface ReportOptions {
  stepPrefix?: string
  dryrunEnabled?: boolean
}

/**
 * Returns a report function bound to the given options (loggerFactory pattern).
 * Usage: const report = reportFactory({ dryrunEnabled: true }); report('message')
 */
export function reportFactory (options: ReportOptions = {}) {
  return function report (...messages: unknown[]): void {
    const dryrunPrefix = options.dryrunEnabled === true ? '[💦]' : ''
    const prnowPrefix = '[PR Now]'
    const reportLine = [prnowPrefix, dryrunPrefix, options.stepPrefix].filter(Boolean).join(' ')
    console.log(reportLine, ...messages)
  }
}
