import { zValidator } from '@hono/zod-validator'
import { Hono } from 'hono'
import {
  createSavedQueryRequestSchema,
  deleteSavedQueryParamsSchema,
} from '@kaggle-competition-finder/schemas'
import {
  createSavedQuery,
  deleteSavedQuery,
  listSavedQueries,
} from '../application/use-cases/manage-saved-queries'
import type { ApiDependencies } from '../lib/di'

export const createSavedQueryRoutes = (dependencies: ApiDependencies) => {
  return new Hono()
    .get('/', async (context) => {
      const queries = await listSavedQueries(dependencies.savedQueries)
      return context.json({ queries })
    })
    .post(
      '/',
      zValidator('json', createSavedQueryRequestSchema),
      async (context) => {
        const { query } = context.req.valid('json')
        const savedQuery = await createSavedQuery(
          query,
          dependencies.now(),
          dependencies.savedQueries,
        )

        return context.json({ query: savedQuery }, 201)
      },
    )
    .delete(
      '/:id',
      zValidator('param', deleteSavedQueryParamsSchema),
      async (context) => {
        const { id } = context.req.valid('param')
        const wasDeleted = await deleteSavedQuery(id, dependencies.savedQueries)

        if (!wasDeleted) {
          return context.json({ error: 'Saved query was not found.' }, 404)
        }

        return context.json({ id })
      },
    )
}
