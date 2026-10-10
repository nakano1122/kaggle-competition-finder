import { zValidator } from '@hono/zod-validator'
import { Hono } from 'hono'
import {
  createFavoriteRequestSchema,
  deleteFavoriteParamsSchema,
} from '@kaggle-competition-finder/schemas'
import {
  createFavoriteCompetition,
  deleteFavoriteCompetition,
  listFavoriteCompetitions,
} from '../application/use-cases/manage-favorite-competitions'
import type { ApiDependencies } from '../lib/di'

export const createFavoriteCompetitionRoutes = (
  dependencies: ApiDependencies,
) => {
  return new Hono()
    .get('/', async (context) => {
      const favorites = await listFavoriteCompetitions(dependencies.favorites)
      return context.json({ favorites })
    })
    .post(
      '/',
      zValidator('json', createFavoriteRequestSchema),
      async (context) => {
        const favorite = await createFavoriteCompetition(
          context.req.valid('json'),
          dependencies.now(),
          dependencies.favorites,
        )

        if (favorite === undefined) {
          return context.json(
            { error: 'Competition is already a favorite.' },
            409,
          )
        }

        return context.json({ favorite }, 201)
      },
    )
    .delete(
      '/:id',
      zValidator('param', deleteFavoriteParamsSchema),
      async (context) => {
        const { id } = context.req.valid('param')
        const wasDeleted = await deleteFavoriteCompetition(
          id,
          dependencies.favorites,
        )

        if (!wasDeleted) {
          return context.json({ error: 'Favorite was not found.' }, 404)
        }

        return context.json({ id })
      },
    )
}
