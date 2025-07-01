import fs from 'fs'
import https from 'https'

interface FetchOptions {
  url: string
  certFilePath?: string
  apiKey?: string
  headers?: Record<string, string>
}

export default async function fetch ({ url, certFilePath, apiKey, headers }: FetchOptions): Promise<string> {
  const urlopts = new URL(url)
  let options: any = {
    hostname: urlopts.hostname,
    path: urlopts.pathname + urlopts.search,
    method: 'GET',
    headers: {
      'User-Agent': 'prnow @ github.com:connected-web/prnow',
      ...(headers ?? {})
    }
  }

  if (typeof certFilePath === 'string' && certFilePath.length > 0) {
    options = Object.assign(options, {
      key: fs.readFileSync(certFilePath),
      cert: fs.readFileSync(certFilePath)
    })
  }

  if (typeof apiKey === 'string' && apiKey.length > 0) {
    options.headers = Object.assign(options.headers, {
      Authorization: `Basic ${apiKey}`
    })
  }

  return await new Promise((resolve, reject) => {
    const req = https.request(options, (res) => {
      let buffer = ''
      res.on('data', (data) => {
        buffer = buffer + String(data)
      })
      res.on('close', () => {
        resolve(buffer)
      })
      res.on('error', reject)
    })
    req.end()
  })
}
