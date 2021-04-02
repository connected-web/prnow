function slug (word) {
  return word.toLowerCase()
    .replace(/[.']/g, '')
    .replace(/[^a-z\d-]/g, ' ')
    .trim()
    .replace(/(\s)+/g, '-')
}

function dedupe (sentence) {
  const words = sentence.split(/\s+/)
  const output = words.filter((word, index, words) => {
    if (index > 0) {
      const previousWord = words[index - 1]
      return slug(word) !== slug(previousWord)
    }
    return true
  })

  return output.join(' ')
}

module.exports = dedupe
