export default function createBranchNameSlug(title: string): string {
  return title.toLowerCase()
    .replace(/[.']/g, '')
    .replace(/[^a-z\d-]/g, ' ')
    .trim()
    .replace(/(\s)+/g, '-')
}
