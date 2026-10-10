import {
  createFavorite,
  createSavedQuery,
  deleteFavorite,
  deleteSavedQuery,
  searchCompetitions,
  updateProfile,
} from '@/lib/api-client'
import { mockKeywords } from '@/lib/search-pipeline'
import type { InitialDashboardData } from '@/lib/mock-data'
import type { PipelineStage } from '@/lib/search-pipeline'
import type {
  Competition,
  Favorite,
  SavedQuery,
} from '@kaggle-competition-finder/schemas'
import { useReducer, useRef } from 'react'

type DashboardState = {
  activeStage: PipelineStage | null
  competitions: Competition[]
  error: string
  favorites: Favorite[]
  isSavingProfile: boolean
  isSavingQuery: boolean
  isSearching: boolean
  profile: string
  query: string
  savedQueries: SavedQuery[]
}

type DashboardAction =
  | { error: string; type: 'set-error' }
  | { profile: string; type: 'set-profile' }
  | { query: string; type: 'set-query' }
  | { type: 'profile-save-started' }
  | { type: 'profile-save-finished' }
  | { type: 'query-save-started' }
  | { query: SavedQuery; type: 'query-save-finished' }
  | { id: string; type: 'query-deleted' }
  | { type: 'search-started' }
  | { competitions: Competition[]; type: 'search-finished' }
  | { favorite: Favorite; type: 'favorite-created' }
  | { competitionId: string; type: 'favorite-deleted' }

const createInitialState = (data: InitialDashboardData): DashboardState => {
  return {
    activeStage: null,
    competitions: [],
    error: '',
    favorites: data.favorites,
    isSavingProfile: false,
    isSavingQuery: false,
    isSearching: false,
    profile: data.profile.content,
    query:
      '自然言語処理や情報検索の経験を活用できるKaggleコンペを探したい。特に、テキスト分類や文書の関連度予測などのタスクに興味がある。',
    savedQueries: data.savedQueries,
  }
}

const dashboardReducer = (
  state: DashboardState,
  action: DashboardAction,
): DashboardState => {
  switch (action.type) {
    case 'set-error':
      return {
        ...state,
        error: action.error,
        isSavingProfile: false,
        isSavingQuery: false,
        isSearching: false,
      }
    case 'set-profile':
      return { ...state, profile: action.profile }
    case 'set-query':
      return { ...state, query: action.query }
    case 'profile-save-started':
      return { ...state, error: '', isSavingProfile: true }
    case 'profile-save-finished':
      return { ...state, isSavingProfile: false }
    case 'query-save-started':
      return { ...state, error: '', isSavingQuery: true }
    case 'query-save-finished':
      return {
        ...state,
        isSavingQuery: false,
        savedQueries: [action.query, ...state.savedQueries],
      }
    case 'query-deleted':
      return {
        ...state,
        savedQueries: state.savedQueries.filter(
          (query) => query.id !== action.id,
        ),
      }
    case 'search-started':
      return {
        ...state,
        activeStage: 'candidates',
        error: '',
        isSearching: true,
      }
    case 'search-finished':
      return {
        ...state,
        activeStage: 'summary',
        competitions: action.competitions,
        isSearching: false,
      }
    case 'favorite-created':
      return { ...state, favorites: [action.favorite, ...state.favorites] }
    case 'favorite-deleted':
      return {
        ...state,
        favorites: state.favorites.filter(
          (favorite) => favorite.competitionId !== action.competitionId,
        ),
      }
  }
}

const errorMessage = (error: unknown, fallback: string) => {
  return error instanceof Error ? error.message : fallback
}

export const useDashboard = (data: InitialDashboardData) => {
  const [state, dispatch] = useReducer(
    dashboardReducer,
    data,
    createInitialState,
  )
  const searchVersion = useRef(0)

  const saveProfile = async () => {
    const content = state.profile.trim()

    if (!content) {
      dispatch({ error: '実績を入力してください。', type: 'set-error' })
      return
    }

    dispatch({ type: 'profile-save-started' })

    try {
      await updateProfile(content)
      dispatch({ type: 'profile-save-finished' })
    } catch (error) {
      dispatch({
        error: errorMessage(error, '実績を保存できませんでした。'),
        type: 'set-error',
      })
    }
  }

  const saveQuery = async () => {
    const query = state.query.trim()

    if (!query) {
      dispatch({
        error: '保存する検索クエリを入力してください。',
        type: 'set-error',
      })
      return
    }

    dispatch({ type: 'query-save-started' })

    try {
      const response = await createSavedQuery(query)
      dispatch({ query: response.query, type: 'query-save-finished' })
    } catch (error) {
      dispatch({
        error: errorMessage(error, '検索クエリを保存できませんでした。'),
        type: 'set-error',
      })
    }
  }

  const removeSavedQuery = async (id: string) => {
    try {
      await deleteSavedQuery(id)
      dispatch({ id, type: 'query-deleted' })
    } catch (error) {
      dispatch({
        error: errorMessage(error, '保存済みクエリを削除できませんでした。'),
        type: 'set-error',
      })
    }
  }

  const search = async () => {
    if (!state.query.trim()) {
      dispatch({ error: '検索クエリを入力してください。', type: 'set-error' })
      return
    }

    const version = searchVersion.current + 1
    searchVersion.current = version
    dispatch({ type: 'search-started' })

    try {
      const response = await searchCompetitions(mockKeywords)

      if (searchVersion.current !== version) {
        return
      }

      dispatch({ competitions: response.competitions, type: 'search-finished' })
    } catch (error) {
      if (searchVersion.current !== version) {
        return
      }

      dispatch({
        error: errorMessage(error, 'コンペを検索できませんでした。'),
        type: 'set-error',
      })
    }
  }

  const toggleFavorite = async (competition: Competition) => {
    const favorite = state.favorites.find(
      (item) => item.competitionId === competition.id,
    )

    try {
      if (favorite) {
        await deleteFavorite(competition.id)
        dispatch({ competitionId: competition.id, type: 'favorite-deleted' })
        return
      }

      const response = await createFavorite(competition)
      dispatch({ favorite: response.favorite, type: 'favorite-created' })
    } catch (error) {
      dispatch({
        error: errorMessage(error, 'お気に入りを更新できませんでした。'),
        type: 'set-error',
      })
    }
  }

  return {
    removeSavedQuery,
    saveProfile,
    saveQuery,
    search,
    setProfile: (profile: string) => dispatch({ profile, type: 'set-profile' }),
    setQuery: (query: string) => dispatch({ query, type: 'set-query' }),
    state,
    toggleFavorite,
  }
}
