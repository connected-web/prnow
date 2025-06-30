function slug(word: string): string {
  return word.toLowerCase()
    .replace(/[.']/g, '')
    .replace(/[^a-z\d-]/g, ' ')
    .trim()
    .replace(/(\s)+/g, '-')
}

export default function dedupe(sentence: string): string {
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
