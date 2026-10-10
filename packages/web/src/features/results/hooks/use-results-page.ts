'use client'

import {
  createFavorite,
  deleteFavorite,
  searchCompetitions,
} from '@/lib/api-client'
import { mockKeywords } from '@/lib/search-pipeline'
import {
  readSearchHistory,
  saveSearchHistory,
} from '@/features/search/lib/search-history-storage'
import type { SearchHistoryItem } from '@/features/search/lib/search-history-storage'
import type { SearchRequest } from '@/features/search/lib/search-request-storage'
import type { PipelineStage } from '@/lib/search-pipeline'
import type { Competition, Favorite } from '@schemas'
import { useReducer, useRef } from 'react'

type ResultsState = {
  activeStage: PipelineStage | null
  error: string
  favorites: Favorite[]
  history: SearchHistoryItem[]
  isSearching: boolean
  query: string
  selectedHistoryId: string | null
}

type ResultsAction =
  | { history: SearchHistoryItem[]; type: 'history-loaded' }
  | { type: 'search-started'; query: string }
  | {
      type: 'search-finished'
      history: SearchHistoryItem[]
      result: SearchHistoryItem
    }
  | { type: 'search-failed'; error: string }
  | { type: 'history-selected'; result: SearchHistoryItem }
  | { favorite: Favorite; type: 'favorite-created' }
  | { competitionId: string; type: 'favorite-deleted' }

const createInitialState = (favorites: Favorite[]): ResultsState => {
  return {
    activeStage: null,
    error: '',
    favorites,
    history: [],
    isSearching: false,
    query: '',
    selectedHistoryId: null,
  }
}

const resultsReducer = (
  state: ResultsState,
  action: ResultsAction,
): ResultsState => {
  switch (action.type) {
    case 'history-loaded': {
      const latestResult = action.history[0]

      if (!latestResult) {
        return { ...state, history: action.history }
      }

      return {
        ...state,
        activeStage: 'summary',
        history: action.history,
        query: latestResult.query,
        selectedHistoryId: latestResult.id,
      }
    }
    case 'search-started':
      return {
        ...state,
        activeStage: 'candidates',
        error: '',
        isSearching: true,
        query: action.query,
        selectedHistoryId: null,
      }
    case 'search-finished':
      return {
        ...state,
        activeStage: 'summary',
        history: action.history,
        isSearching: false,
        query: action.result.query,
        selectedHistoryId: action.result.id,
      }
    case 'search-failed':
      return {
        ...state,
        error: action.error,
        isSearching: false,
      }
    case 'history-selected':
      return {
        ...state,
        activeStage: 'summary',
        error: '',
        query: action.result.query,
        selectedHistoryId: action.result.id,
      }
    case 'favorite-created':
      return { ...state, favorites: [action.favorite, ...state.favorites] }
    case 'favorite-deleted':
      return {
        ...state,
        favorites: state.favorites.filter((favorite) => {
          return favorite.competitionId !== action.competitionId
        }),
      }
  }
}

const errorMessage = (error: unknown, fallback: string) => {
  return error instanceof Error ? error.message : fallback
}

const createSearchHistoryItem = (
  query: string,
  competitions: Competition[],
  version: number,
): SearchHistoryItem => {
  const searchedAt = new Date().toISOString()

  return {
    competitions,
    id: `${searchedAt}-${version}`,
    query,
    searchedAt,
  }
}

export const useResultsPage = (favorites: Favorite[]) => {
  const [state, dispatch] = useReducer(
    resultsReducer,
    favorites,
    createInitialState,
  )
  const searchVersion = useRef(0)

  const search = async (request: SearchRequest) => {
    const version = searchVersion.current + 1
    searchVersion.current = version
    dispatch({ query: request.query, type: 'search-started' })

    try {
      const response = await searchCompetitions(mockKeywords)

      if (searchVersion.current !== version) {
        return
      }

      const result = createSearchHistoryItem(
        request.query,
        response.competitions,
        version,
      )
      dispatch({
        history: saveSearchHistory(result),
        result,
        type: 'search-finished',
      })
    } catch (error) {
      if (searchVersion.current !== version) {
        return
      }

      dispatch({
        error: errorMessage(error, 'コンペを検索できませんでした。'),
        type: 'search-failed',
      })
    }
  }

  const selectSearchHistory = (id: string) => {
    const result = state.history.find((item) => item.id === id)

    if (result) {
      dispatch({ result, type: 'history-selected' })
    }
  }

  const loadHistory = () => {
    dispatch({ history: readSearchHistory(), type: 'history-loaded' })
  }

  const toggleFavorite = async (competition: Competition) => {
    const favorite = state.favorites.find((item) => {
      return item.competitionId === competition.id
    })

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
        type: 'search-failed',
      })
    }
  }

  return {
    loadHistory,
    search,
    selectSearchHistory,
    state,
    toggleFavorite,
  }
}
