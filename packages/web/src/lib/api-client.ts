import {
  competitionsResponseSchema,
  createFavoriteResponseSchema,
  createSavedQueryResponseSchema,
  deleteResponseSchema,
  updateProfileResponseSchema,
} from '@kaggle-competition-finder/schemas'
import type { Competition } from '@kaggle-competition-finder/schemas'

type ApiMethod = 'DELETE' | 'POST' | 'PUT'
type ResponseSchema<T> = { parse: (value: unknown) => T }

async function request<T>(
  path: string,
  schema: ResponseSchema<T>,
  options: { body?: unknown; method?: ApiMethod } = {},
): Promise<T> {
  const response = await fetch(`/api${path}`, {
    method: options.method,
    headers: options.body ? { 'Content-Type': 'application/json' } : undefined,
    body: options.body ? JSON.stringify(options.body) : undefined,
  })

  if (!response.ok) {
    throw new Error(
      'データを更新できませんでした。しばらくしてからお試しください。',
    )
  }

  return schema.parse(await response.json())
}

export function updateProfile(content: string) {
  return request('/profile', updateProfileResponseSchema, {
    method: 'PUT',
    body: { content },
  })
}

export function createSavedQuery(query: string) {
  return request('/queries', createSavedQueryResponseSchema, {
    method: 'POST',
    body: { query },
  })
}

export function deleteSavedQuery(id: string) {
  return request(`/queries/${id}`, deleteResponseSchema, { method: 'DELETE' })
}

export function searchCompetitions(keywords: string[]) {
  const searchParams = new URLSearchParams({ keywords: keywords.join(',') })
  return request(`/competitions?${searchParams}`, competitionsResponseSchema)
}

export function createFavorite(competition: Competition) {
  return request('/favorites', createFavoriteResponseSchema, {
    method: 'POST',
    body: {
      competitionId: competition.id,
      title: competition.title,
      url: competition.url,
    },
  })
}

export function deleteFavorite(competitionId: string) {
  return request(`/favorites/${competitionId}`, deleteResponseSchema, {
    method: 'DELETE',
  })
}
