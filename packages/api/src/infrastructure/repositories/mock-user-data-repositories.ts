import type {
  CreateFavoriteRequest,
  Favorite,
  Profile,
  SavedQuery,
} from '@kaggle-competition-finder/schemas'
import type { FavoriteCompetitionRepository } from '../../domain/repositories/favorite-competition-repository'
import type { ProfileRepository } from '../../domain/repositories/profile-repository'
import type { SavedQueryRepository } from '../../domain/repositories/saved-query-repository'

type MockUserData = {
  favorites: Favorite[]
  nextQueryId: number
  profile: Profile | null
  queries: SavedQuery[]
}

export type MockUserDataRepositories = {
  favorites: FavoriteCompetitionRepository
  profiles: ProfileRepository
  savedQueries: SavedQueryRepository
}

const defaultProfile: Profile = {
  content:
    '情報検索と自然言語処理の研究に取り組み、Dense Retrieval と Reranking モデルを実装してきた。',
  updatedAt: '2026-10-10T00:00:00.000Z',
}

const defaultQuery: SavedQuery = {
  id: 'query-1',
  query: '自然言語処理や情報検索の経験を活用できるコンペを探したい。',
  createdAt: '2026-10-10T00:00:00.000Z',
}

const defaultFavorite: Favorite = {
  competitionId: 'us-patent-phrase-to-phrase-matching',
  title: 'U.S. Patent Phrase to Phrase Matching',
  url: 'https://www.kaggle.com/competitions/us-patent-phrase-to-phrase-matching',
  createdAt: '2026-10-10T00:00:00.000Z',
}

const createMockUserData = (): MockUserData => {
  return {
    favorites: [defaultFavorite],
    nextQueryId: 2,
    profile: defaultProfile,
    queries: [defaultQuery],
  }
}

const findProfile = (data: MockUserData) => Promise.resolve(data.profile)

const saveProfile = (data: MockUserData, profile: Profile) => {
  data.profile = profile
  return Promise.resolve(profile)
}

const listSavedQueries = (data: MockUserData) => Promise.resolve(data.queries)

const createSavedQuery = (
  data: MockUserData,
  query: string,
  createdAt: string,
) => {
  const savedQuery = { id: `query-${data.nextQueryId}`, query, createdAt }

  data.nextQueryId += 1
  data.queries.unshift(savedQuery)

  return Promise.resolve(savedQuery)
}

const deleteSavedQuery = (data: MockUserData, id: string) => {
  const queryIndex = data.queries.findIndex((query) => query.id === id)

  if (queryIndex === -1) {
    return Promise.resolve(false)
  }

  data.queries.splice(queryIndex, 1)
  return Promise.resolve(true)
}

const listFavoriteCompetitions = (data: MockUserData) => {
  return Promise.resolve(data.favorites)
}

const createFavoriteCompetition = (
  data: MockUserData,
  favorite: CreateFavoriteRequest,
  createdAt: string,
) => {
  const alreadyExists = data.favorites.some((item) => {
    return item.competitionId === favorite.competitionId
  })

  if (alreadyExists) {
    return Promise.resolve(undefined)
  }

  const savedFavorite = { ...favorite, createdAt }
  data.favorites.unshift(savedFavorite)

  return Promise.resolve(savedFavorite)
}

const deleteFavoriteCompetition = (
  data: MockUserData,
  competitionId: string,
) => {
  const favoriteIndex = data.favorites.findIndex((favorite) => {
    return favorite.competitionId === competitionId
  })

  if (favoriteIndex === -1) {
    return Promise.resolve(false)
  }

  data.favorites.splice(favoriteIndex, 1)
  return Promise.resolve(true)
}

export const createMockUserDataRepositories = (): MockUserDataRepositories => {
  const data = createMockUserData()

  return {
    favorites: {
      create: (favorite, createdAt) => {
        return createFavoriteCompetition(data, favorite, createdAt)
      },
      delete: (competitionId) => deleteFavoriteCompetition(data, competitionId),
      list: () => listFavoriteCompetitions(data),
    },
    profiles: {
      find: () => findProfile(data),
      save: (profile) => saveProfile(data, profile),
    },
    savedQueries: {
      create: (query, createdAt) => createSavedQuery(data, query, createdAt),
      delete: (id) => deleteSavedQuery(data, id),
      list: () => listSavedQueries(data),
    },
  }
}
