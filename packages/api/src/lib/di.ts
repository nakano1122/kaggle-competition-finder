import type { FavoriteCompetitionRepository } from '../domain/repositories/favorite-competition-repository'
import type { ProfileRepository } from '../domain/repositories/profile-repository'
import type { SavedQueryRepository } from '../domain/repositories/saved-query-repository'
import type { CompetitionCatalog } from '../domain/services/competition-catalog'
import { createMockUserDataRepositories } from '../infrastructure/repositories/mock-user-data-repositories'
import { createMockKaggleCompetitionCatalog } from '../infrastructure/services/mock-kaggle-competition-catalog'

export type ApiDependencies = {
  competitions: CompetitionCatalog
  favorites: FavoriteCompetitionRepository
  now: () => string
  profiles: ProfileRepository
  savedQueries: SavedQueryRepository
}

export const createMockDependencies = (): ApiDependencies => {
  const userDataRepositories = createMockUserDataRepositories()

  return {
    competitions: createMockKaggleCompetitionCatalog(),
    favorites: userDataRepositories.favorites,
    now: () => new Date().toISOString(),
    profiles: userDataRepositories.profiles,
    savedQueries: userDataRepositories.savedQueries,
  }
}
