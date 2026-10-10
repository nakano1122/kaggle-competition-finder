import type { FavoriteCompetition } from '@/domain/entities/favorite-competition'
import type { FavoriteCompetitionRepository } from '@/domain/repositories/favorite-competition-repository'

export const saveFavoriteCompetition = (
  favorite: FavoriteCompetition,
  repository: FavoriteCompetitionRepository,
): Promise<FavoriteCompetition | undefined> => {
  return repository.create(favorite)
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
