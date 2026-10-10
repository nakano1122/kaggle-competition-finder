import { zValidator } from '@hono/zod-validator'
import { Hono } from 'hono'
import { updateProfileRequestSchema } from '@kaggle-competition-finder/schemas'
import {
  getProfile,
  updateProfile,
} from '../application/use-cases/manage-profile'
import type { ApiDependencies } from '../lib/di'

export const createProfileRoutes = (dependencies: ApiDependencies) => {
  return new Hono()
    .get('/', async (context) => {
      const profile = await getProfile(dependencies.profiles)
      return context.json({ profile })
    })
    .put(
      '/',
      zValidator('json', updateProfileRequestSchema),
      async (context) => {
        const { content } = context.req.valid('json')
        const profile = await updateProfile(
          content,
          dependencies.now(),
          dependencies.profiles,
        )

        return context.json({ profile })
      },
    )
}
