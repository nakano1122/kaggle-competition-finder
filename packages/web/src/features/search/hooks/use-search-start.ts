'use client'

import { saveSearchRequest } from '@/features/search/lib/search-request-storage'
import { useRouter } from 'next/navigation'
import { useEffect, useReducer } from 'react'

const profileStorageKey = 'kaggle-competition-finder:profile'

type StoredProfile = {
  content: string
  updatedAt: string
}

type SearchStartState = {
  error: string
  isLoaded: boolean
  isProfileSaved: boolean
  isQueryEdited: boolean
  profile: string
  query: string
  savedAt: string | null
}

type SearchStartAction =
  | { profile: StoredProfile | null; type: 'profile-loaded' }
  | { profile: string; type: 'profile-changed' }
  | { query: string; type: 'query-changed' }
  | { savedAt: string; type: 'profile-saved' }
  | { error: string; type: 'error-set' }
  | { type: 'error-cleared' }

const createGeneratedQuery = (profile: string) => {
  const trimmedProfile = profile.trim()

  if (!trimmedProfile) {
    return ''
  }

  return `次の研究内容・興味を活かせるKaggleコンペを探してください。\n\n${trimmedProfile}`
}

const createInitialState = (): SearchStartState => {
  return {
    error: '',
    isLoaded: false,
    isProfileSaved: false,
    isQueryEdited: false,
    profile: '',
    query: '',
    savedAt: null,
  }
}

const searchStartReducer = (
  state: SearchStartState,
  action: SearchStartAction,
): SearchStartState => {
  switch (action.type) {
    case 'profile-loaded': {
      const profile = action.profile?.content ?? ''

      return {
        ...state,
        isLoaded: true,
        isProfileSaved: action.profile !== null,
        profile,
        query: createGeneratedQuery(profile),
        savedAt: action.profile?.updatedAt ?? null,
      }
    }
    case 'profile-changed':
      return {
        ...state,
        error: '',
        isProfileSaved: false,
        profile: action.profile,
        query: state.isQueryEdited
          ? state.query
          : createGeneratedQuery(action.profile),
      }
    case 'query-changed':
      return {
        ...state,
        error: '',
        isQueryEdited: true,
        query: action.query,
      }
    case 'profile-saved':
      return {
        ...state,
        error: '',
        isProfileSaved: true,
        savedAt: action.savedAt,
      }
    case 'error-set':
      return { ...state, error: action.error }
    case 'error-cleared':
      return { ...state, error: '' }
  }
}

const isStoredProfile = (value: unknown): value is StoredProfile => {
  if (typeof value !== 'object' || value === null) {
    return false
  }

  if (!('content' in value) || !('updatedAt' in value)) {
    return false
  }

  return (
    typeof value.content === 'string' &&
    typeof value.updatedAt === 'string' &&
    !Number.isNaN(Date.parse(value.updatedAt))
  )
}

const readStoredProfile = (): StoredProfile | null => {
  try {
    const storedValue = window.localStorage.getItem(profileStorageKey)

    if (!storedValue) {
      return null
    }

    const parsedValue: unknown = JSON.parse(storedValue)
    return isStoredProfile(parsedValue) ? parsedValue : null
  } catch {
    return null
  }
}

const writeStoredProfile = (profile: string, savedAt: string) => {
  const storedProfile: StoredProfile = { content: profile, updatedAt: savedAt }
  window.localStorage.setItem(profileStorageKey, JSON.stringify(storedProfile))
}

export const useSearchStart = () => {
  const router = useRouter()
  const [state, dispatch] = useReducer(
    searchStartReducer,
    undefined,
    createInitialState,
  )

  useEffect(() => {
    dispatch({ profile: readStoredProfile(), type: 'profile-loaded' })
  }, [])

  const setProfile = (profile: string) => {
    dispatch({ profile, type: 'profile-changed' })
  }

  const setQuery = (query: string) => {
    dispatch({ query, type: 'query-changed' })
  }

  const saveProfile = () => {
    const profile = state.profile.trim()

    if (!profile) {
      dispatch({
        error: '研究内容や興味を入力してください。',
        type: 'error-set',
      })
      return
    }

    const savedAt = new Date().toISOString()

    try {
      writeStoredProfile(profile, savedAt)
      dispatch({ savedAt, type: 'profile-saved' })
    } catch {
      dispatch({
        error:
          'ブラウザに保存できませんでした。ストレージの設定を確認してください。',
        type: 'error-set',
      })
    }
  }

  const startSearch = () => {
    const profile = state.profile.trim()
    const query = state.query.trim()

    if (!profile) {
      dispatch({
        error: '研究内容や興味を入力してください。',
        type: 'error-set',
      })
      return
    }

    if (!query) {
      dispatch({
        error: 'LLMで生成したクエリを入力してください。',
        type: 'error-set',
      })
      return
    }

    const saved = saveSearchRequest({
      createdAt: new Date().toISOString(),
      profile,
      query,
    })

    if (!saved) {
      dispatch({
        error:
          '検索条件を保存できませんでした。ブラウザの設定を確認してください。',
        type: 'error-set',
      })
      return
    }

    dispatch({ type: 'error-cleared' })
    router.push('/results')
  }

  return { saveProfile, setProfile, setQuery, startSearch, state }
}
