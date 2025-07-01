import fs from 'fs'
import { promisify } from 'util'

export const read = promisify(fs.readFile)
export const write = promisify(fs.writeFile)
export const mkdir = promisify(fs.mkdir)
export const stat = promisify(fs.stat)
export const rename = promisify(fs.rename)

const report = (...messages: unknown[]): void => console.log('[Async FS]', ...messages)

export const exists = async (itemPath: string): Promise<boolean> => {
  try {
    await stat(itemPath)
    return true
  } catch (err) {
    return false
  }
}

export const safeCreateDirectory = async (directoryPath: string): Promise<void> => {
  try {
    await mkdir(directoryPath, { recursive: true })
  } catch (err: unknown) {
    if (err !== null && typeof err === 'object' && 'code' in err && (err as { code?: string }).code === 'EEXIST') {
      report(`Directory: ${directoryPath} already exists`)
    } else {
      report(err)
    }
  }
}

export const readJson = async (jsonFilePath: string): Promise<unknown> => {
  const jsonFile = await read(jsonFilePath, 'utf-8')
  return JSON.parse(jsonFile)
}
