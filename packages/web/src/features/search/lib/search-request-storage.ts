export type SearchRequest = {
  createdAt: string
  profile: string
  query: string
}

const searchRequestStorageKey = 'kaggle-competition-finder:search-request'

const isSearchRequest = (value: unknown): value is SearchRequest => {
  if (typeof value !== 'object' || value === null) {
    return false
  }

  if (!('createdAt' in value) || !('profile' in value) || !('query' in value)) {
    return false
  }

  return (
    typeof value.createdAt === 'string' &&
    typeof value.profile === 'string' &&
    typeof value.query === 'string' &&
    !Number.isNaN(Date.parse(value.createdAt))
  )
}

export const saveSearchRequest = (request: SearchRequest) => {
  if (typeof window === 'undefined') {
    return false
  }

  try {
    window.sessionStorage.setItem(
      searchRequestStorageKey,
      JSON.stringify(request),
    )
    return true
  } catch {
    return false
  }
}

export const readSearchRequest = (): SearchRequest | null => {
  if (typeof window === 'undefined') {
    return null
  }

  try {
    const storedValue = window.sessionStorage.getItem(searchRequestStorageKey)

    if (!storedValue) {
      return null
    }

    const parsedValue: unknown = JSON.parse(storedValue)
    return isSearchRequest(parsedValue) ? parsedValue : null
  } catch {
    return null
  }
}

export const clearSearchRequest = () => {
  if (typeof window === 'undefined') {
    return
  }

  try {
    window.sessionStorage.removeItem(searchRequestStorageKey)
  } catch {
    // Storage access can be disabled by the browser.
  }
}
