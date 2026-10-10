import type {
  CreateFavoriteRequest,
  Favorite,
} from '@kaggle-competition-finder/schemas'

export type FavoriteCompetitionRepository = {
  create: (
    favorite: CreateFavoriteRequest,
    createdAt: string,
  ) => Promise<Favorite | undefined>
  delete: (competitionId: string) => Promise<boolean>
  list: () => Promise<Favorite[]>
}
