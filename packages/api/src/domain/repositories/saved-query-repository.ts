import type { SavedSearchQuery } from '@/domain/entities/saved-search-query'

export type SavedQueryRepository = {
  create: (query: string, createdAt: string) => Promise<SavedSearchQuery>
  delete: (id: string) => Promise<boolean>
  list: () => Promise<SavedSearchQuery[]>
}
