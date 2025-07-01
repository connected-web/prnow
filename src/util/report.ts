// Centralized report/logging utility for prnow
// Usage: const report = reportFactory({ dryrunEnabled: true }); report('message')

export interface ReportOptions {
  stepPrefix?: string;
  dryrunEnabled?: boolean;
}

/**
 * Returns a report function bound to the given options (loggerFactory pattern).
 * Usage: const report = reportFactory({ dryrunEnabled: true }); report('message')
 */
export function reportFactory(options: ReportOptions = {}) {
  return function report(message: string): void {
    const dryrunPrefix = options.dryrunEnabled ? '[💦]' : ''
    const prnowPrefix = '[PR Now]'
    message.split('\n').forEach(line => {
      if (line.trim().length > 0) {
        const reportLine = `${prnowPrefix} ${dryrunPrefix} ${options.stepPrefix} ${line.trim()}`
        console.log(reportLine)
      } else {
        console.log('')
      }
    })
  }
}
