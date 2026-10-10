import { competitionsResponseSchema } from '@kaggle-competition-finder/schemas'
import type { Competition } from '@kaggle-competition-finder/schemas'

const storageKey = 'kaggle-competition-finder.search-history'
const historyLimit = 6

export type SearchHistoryItem = {
  competitions: Competition[]
  id: string
  query: string
  searchedAt: string
}

const isRecord = (value: unknown): value is Record<string, unknown> => {
  return typeof value === 'object' && value !== null
}

const parseSearchHistoryItem = (value: unknown): SearchHistoryItem | null => {
  if (!isRecord(value)) {
    return null
  }

  if (
    typeof value.id !== 'string' ||
    typeof value.query !== 'string' ||
    typeof value.searchedAt !== 'string' ||
    Number.isNaN(Date.parse(value.searchedAt))
  ) {
    return null
  }

  const parsedCompetitions = competitionsResponseSchema.safeParse({
    competitions: value.competitions,
  })

  if (!parsedCompetitions.success) {
    return null
  }

  return {
    competitions: parsedCompetitions.data.competitions,
    id: value.id,
    query: value.query,
    searchedAt: value.searchedAt,
  }
}

const parseSearchHistory = (value: string | null): SearchHistoryItem[] => {
  if (!value) {
    return []
  }

  try {
    const parsedValue: unknown = JSON.parse(value)

    if (!Array.isArray(parsedValue)) {
      return []
    }

    return parsedValue
      .map(parseSearchHistoryItem)
      .filter((item): item is SearchHistoryItem => item !== null)
  } catch {
    return []
  }
}

export const readSearchHistory = (): SearchHistoryItem[] => {
  if (typeof window === 'undefined') {
    return []
  }

  try {
    return parseSearchHistory(window.localStorage.getItem(storageKey))
  } catch {
    return []
  }
}

export const saveSearchHistory = (
  item: SearchHistoryItem,
): SearchHistoryItem[] => {
  const history = readSearchHistory().filter((historyItem) => {
    return historyItem.id !== item.id
  })
  const nextHistory = [item, ...history].slice(0, historyLimit)

  try {
    window.localStorage.setItem(storageKey, JSON.stringify(nextHistory))
  } catch {
    return history
  }

  return nextHistory
}
