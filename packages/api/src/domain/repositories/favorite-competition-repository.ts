import type { FavoriteCompetition } from '@/domain/entities/favorite-competition'

export type FavoriteCompetitionRepository = {
  create: (
    favorite: FavoriteCompetition,
  ) => Promise<FavoriteCompetition | undefined>
  delete: (competitionId: string) => Promise<boolean>
  list: () => Promise<FavoriteCompetition[]>
}
