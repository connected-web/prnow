function createBranchNameSlug (title) {
  return title.toLowerCase()
    .replace(/[.']/g, '')
    .replace(/[^a-z\d-]/g, ' ')
    .trim()
    .replace(/(\s)+/g, '-')
}

module.exports = createBranchNameSlug
