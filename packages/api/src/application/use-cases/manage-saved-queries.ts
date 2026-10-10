import type { SavedQuery } from '@kaggle-competition-finder/schemas'
import type { SavedQueryRepository } from '../../domain/repositories/saved-query-repository'

export const createSavedQuery = (
  query: string,
  createdAt: string,
  repository: SavedQueryRepository,
): Promise<SavedQuery> => {
  return repository.create(query, createdAt)
}

export const deleteSavedQuery = (
  id: string,
  repository: SavedQueryRepository,
) => {
  return repository.delete(id)
}

export const listSavedQueries = (repository: SavedQueryRepository) => {
  return repository.list()
}
