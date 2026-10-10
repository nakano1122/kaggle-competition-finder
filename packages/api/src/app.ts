import { Hono } from 'hono'
import { healthStatusSchema } from '@schemas'
import { createMockDependencies } from '@/lib/di'
import { createCompetitionRoutes } from '@/routes/competitions'
import { createFavoriteCompetitionRoutes } from '@/routes/favorite-competitions'
import { createProfileRoutes } from '@/routes/profile'
import { createSavedQueryRoutes } from '@/routes/saved-queries'
import type { ApiDependencies } from '@/lib/di'

export const createApp = (dependencies = createMockDependencies()) => {
  const app = new Hono()

  return app
    .get('/api/health', (context) => {
      return context.json(healthStatusSchema.parse({ status: 'ok' }))
    })
    .route('/api/profile', createProfileRoutes(dependencies))
    .route('/api/queries', createSavedQueryRoutes(dependencies))
    .route('/api/favorites', createFavoriteCompetitionRoutes(dependencies))
    .route('/api/competitions', createCompetitionRoutes(dependencies))
}

export type AppDependencies = ApiDependencies
