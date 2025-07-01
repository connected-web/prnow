import { exec as execCb } from 'child_process'

export interface ExecResult {
  stdout: string
  stderr: string
}

export default async function exec (command: string, options?: Record<string, unknown>): Promise<ExecResult> {
  return await new Promise((resolve, reject) => {
    execCb(command, options, (error, stdout, stderr) => {
      if (error !== null && error !== undefined) {
        reject(error)
      } else {
        resolve({
          stdout: typeof stdout === 'string' ? stdout.toString().trim() : '',
          stderr: typeof stderr === 'string' ? stderr.toString().trim() : ''
        })
      }
    })
  })
}
