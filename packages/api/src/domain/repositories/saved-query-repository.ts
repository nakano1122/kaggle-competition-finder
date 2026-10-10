import type { SavedQuery } from '@kaggle-competition-finder/schemas'

export type SavedQueryRepository = {
  create: (query: string, createdAt: string) => Promise<SavedQuery>
  delete: (id: string) => Promise<boolean>
  list: () => Promise<SavedQuery[]>
}
