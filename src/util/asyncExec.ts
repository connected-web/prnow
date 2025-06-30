import { exec as execCb } from 'child_process'

export interface ExecResult {
  stdout: string
  stderr: string
}

export default function exec(command: string, options?: any): Promise<ExecResult> {
  return new Promise((resolve, reject) => {
    execCb(command, options, (error, stdout, stderr) => {
      if (error) {
        reject(error)
      } else {
        resolve({
          stdout: (stdout ? stdout.toString().trim() : ''),
          stderr: (stderr ? stderr.toString().trim() : '')
        })
      }
    })
  })
}
