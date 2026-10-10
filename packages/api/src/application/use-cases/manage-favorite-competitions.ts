import type {
  CreateFavoriteRequest,
  Favorite,
} from '@kaggle-competition-finder/schemas'
import type { FavoriteCompetitionRepository } from '../../domain/repositories/favorite-competition-repository'

export const createFavoriteCompetition = (
  favorite: CreateFavoriteRequest,
  createdAt: string,
  repository: FavoriteCompetitionRepository,
): Promise<Favorite | undefined> => {
  return repository.create(favorite, createdAt)
}

export const deleteFavoriteCompetition = (
  competitionId: string,
  repository: FavoriteCompetitionRepository,
) => {
  return repository.delete(competitionId)
}

export const listFavoriteCompetitions = (
  repository: FavoriteCompetitionRepository,
) => {
  return repository.list()
}
