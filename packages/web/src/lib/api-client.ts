import {
  competitionsResponseSchema,
  createFavoriteResponseSchema,
  deleteResponseSchema,
} from '@schemas'
import type { Competition } from '@schemas'

type ApiMethod = 'DELETE' | 'POST' | 'PUT'
type ResponseSchema<T> = { parse: (value: unknown) => T }

const request = async <T>(
  path: string,
  schema: ResponseSchema<T>,
  options: { body?: unknown; method?: ApiMethod } = {},
): Promise<T> => {
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

export const searchCompetitions = (keywords: string[]) => {
  const searchParams = new URLSearchParams({ keywords: keywords.join(',') })
  return request(`/competitions?${searchParams}`, competitionsResponseSchema)
}

export const createFavorite = (competition: Competition) => {
  return request('/favorites', createFavoriteResponseSchema, {
    method: 'POST',
    body: {
      competitionId: competition.id,
      title: competition.title,
      url: competition.url,
    },
  })
}

export const deleteFavorite = (competitionId: string) => {
  return request(`/favorites/${competitionId}`, deleteResponseSchema, {
    method: 'DELETE',
  })
}
