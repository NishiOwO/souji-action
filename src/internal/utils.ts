export const convertRef = ((str, { refType }) => {
  if (str === null || str === undefined) return null
  if (str.startsWith('refs/')) return str
  switch (refType) {
    case 'branch':
      return `refs/heads/${str}`
    case 'tag':
      return `refs/tags/${str}`
    case 'pull':
      return `refs/pull/${str}/merge`
    default:
      return null
  }
}) satisfies (
  str: string | undefined | null,
  { refType }: { refType: 'branch' | 'tag' | 'pull' }
) => string | null
