import fs from 'fs'
import https from 'https'

interface FetchOptions {
  url: string
  certFilePath?: string
  apiKey?: string
}

export default async function fetch({ url, certFilePath, apiKey }: FetchOptions): Promise<string> {
  const urlopts = new URL(url)
  let options: any = {
    hostname: urlopts.hostname,
    path: urlopts.pathname,
    method: 'GET',
    headers: {
      'User-Agent': 'prnow @ github.com:connected-web/prnow'
    }
  }

  if (certFilePath) {
    options = Object.assign(options, {
      key: fs.readFileSync(certFilePath),
      cert: fs.readFileSync(certFilePath)
    })
  }

  if (apiKey) {
    options.headers = Object.assign(options.headers, {
      Authorization: `Basic ${apiKey}`
    })
  }

  return new Promise((resolve, reject) => {
    const req = https.request(options, (res) => {
      let buffer = ''
      res.on('data', (data) => {
        buffer = buffer + data
      })
      res.on('close', () => {
        resolve(buffer)
      })
      res.on('error', reject)
    })
    req.end()
  })
}
