export type SavedSearchQuery = {
  id: string
  query: string
  createdAt: string
}

export type SavedSearchQueryInput = SavedSearchQuery

export const createSavedSearchQuery = (
  input: SavedSearchQueryInput,
): SavedSearchQuery | undefined => {
  const id = input.id.trim()
  const query = input.query.trim()

  if (id.length === 0 || query.length === 0) {
    return undefined
  }

  return { ...input, id, query }
}
