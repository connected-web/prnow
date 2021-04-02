const fs = require('fs')
const https = require('https')

async function fetch ({ url, certFilePath, apiKey }) {
  const urlopts = new URL(url)
  const options = {
    hostname: urlopts.hostname,
    path: urlopts.pathname,
    method: urlopts.method,
    headers: {
      'User-Agent': 'prnow @ github.com:connected-web/prnow'
    }
  }

  if (certFilePath) {
    options = Object.assign(options, {
      key: fs.readFileSync(certFilePath),
      cert: fs.readFileSync(certFilePath),
    })
  }

  if (apiKey) {
    options.headers = Object.assign(options.headers, {
      'Authorization': `Basic ${apiKey}`
    })
  }

  let resolveFn, rejectFn
  const promise = new Promise((resolve, reject) => {
    resolveFn = resolve
    rejectFn = reject
  })

  const req = https.request(options, (res) => {
    let buffer = ''
    res.on('data', (data) => {
      buffer = buffer + data
    })
    res.on('close', () => {
      resolveFn(buffer)
    })
    res.on('error', rejectFn)
  })
  req.end()

  return promise
}

module.exports = fetch
