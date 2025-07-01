import { exec as execCb } from 'child_process'

export interface ExecResult {
  code: number
  stdout: string
  stderr: string
}

export default async function exec (command: string, options?: Record<string, unknown>): Promise<ExecResult> {
  return await new Promise((resolve) => {
    execCb(command, options, (error, stdout, stderr) => {
      resolve({
        code: (error != null) && typeof error.code === 'number' ? error.code : 0,
        stdout: typeof stdout === 'string' ? stdout.toString().trim() : '',
        stderr: typeof stderr === 'string' ? stderr.toString().trim() : ''
      })
    })
  })
}
