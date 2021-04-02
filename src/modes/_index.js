const modes = [
  'default',
  'reset'
]

module.exports = modes.reduce((acc, modeName) => {
  acc[modeName] = require(`./${modeName}`)
  return acc
}, {})
