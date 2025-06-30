import fs from 'fs'
import { promisify } from 'util'

export const read = promisify(fs.readFile)
export const write = promisify(fs.writeFile)
export const mkdir = promisify(fs.mkdir)
export const stat = promisify(fs.stat)
export const rename = promisify(fs.rename)

const report = (...messages: any[]) => console.log('[Async FS]', ...messages)

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
  } catch (err: any) {
    if (err && err.code === 'EEXIST') {
      report(`Directory: ${directoryPath} already exists`)
    } else {
      report(err)
    }
  }
}

export const readJson = async (jsonFilePath: string): Promise<any> => {
  const jsonFile = await read(jsonFilePath, 'utf-8')
  return JSON.parse(jsonFile)
}
