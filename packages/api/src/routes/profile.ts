import { zValidator } from '@hono/zod-validator'
import { Hono } from 'hono'
import { updateProfileRequestSchema } from '@schemas'
import { createResearchAndDevelopmentExperience } from '@/domain/entities/research-and-development-experience'
import {
  getProfile,
  updateProfile,
} from '@/application/use-cases/manage-profile'
import type { ApiDependencies } from '@/lib/di'

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
        const profile = createResearchAndDevelopmentExperience({
          content,
          updatedAt: dependencies.now(),
        })

        if (profile === undefined) {
          return context.json({ error: 'Profile content is required.' }, 400)
        }

        await updateProfile(profile, dependencies.profiles)

        return context.json({ profile })
      },
    )
}
