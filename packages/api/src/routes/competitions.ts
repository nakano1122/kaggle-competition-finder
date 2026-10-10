import { zValidator } from '@hono/zod-validator'
import { Hono } from 'hono'
import {
  competitionDetailParamsSchema,
  competitionSearchQuerySchema,
} from '@kaggle-competition-finder/schemas'
import {
  getCompetition,
  searchCompetitions,
} from '../application/use-cases/search-competitions'
import type { ApiDependencies } from '../lib/di'

export const createCompetitionRoutes = (dependencies: ApiDependencies) => {
  return new Hono()
    .get(
      '/',
      zValidator('query', competitionSearchQuerySchema),
      async (context) => {
        const { keywords } = context.req.valid('query')
        const competitions = await searchCompetitions(
          keywords,
          dependencies.competitions,
        )

        return context.json({ competitions })
      },
    )
    .get(
      '/:id',
      zValidator('param', competitionDetailParamsSchema),
      async (context) => {
        const { id } = context.req.valid('param')
        const competition = await getCompetition(id, dependencies.competitions)

        if (competition === null) {
          return context.json({ error: 'Competition was not found.' }, 404)
        }

        return context.json({ competition })
      },
    )
}
