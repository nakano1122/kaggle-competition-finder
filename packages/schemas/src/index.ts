import { z } from 'zod'

const identifierSchema = z.string().trim().min(1).max(200)
const timestampSchema = z.iso.datetime()
const keywordSchema = z.string().trim().min(1).max(200)

export const healthStatusSchema = z.object({
  status: z.literal('ok'),
})

export const profileSchema = z.object({
  content: z.string().trim().min(1).max(10_000),
  updatedAt: timestampSchema,
})

export const profileResponseSchema = z.object({
  profile: profileSchema.nullable(),
})

export const updateProfileRequestSchema = z.object({
  content: z.string().trim().min(1).max(10_000),
})

export const updateProfileResponseSchema = z.object({
  profile: profileSchema,
})

export const savedQuerySchema = z.object({
  id: identifierSchema,
  query: z.string().trim().min(1).max(2_000),
  createdAt: timestampSchema,
})

export const savedQueriesResponseSchema = z.object({
  queries: z.array(savedQuerySchema),
})

export const createSavedQueryRequestSchema = z.object({
  query: z.string().trim().min(1).max(2_000),
})

export const createSavedQueryResponseSchema = z.object({
  query: savedQuerySchema,
})

export const deleteSavedQueryParamsSchema = z.object({
  id: identifierSchema,
})

export const favoriteSchema = z.object({
  competitionId: identifierSchema,
  title: z.string().trim().min(1).max(300),
  url: z.url(),
  createdAt: timestampSchema,
})

export const favoritesResponseSchema = z.object({
  favorites: z.array(favoriteSchema),
})

export const createFavoriteRequestSchema = z.object({
  competitionId: identifierSchema,
  title: z.string().trim().min(1).max(300),
  url: z.url(),
})

export const createFavoriteResponseSchema = z.object({
  favorite: favoriteSchema,
})

export const deleteFavoriteParamsSchema = z.object({
  id: identifierSchema,
})

export const competitionSchema = z.object({
  id: identifierSchema,
  title: z.string().trim().min(1).max(300),
  url: z.url(),
  category: z.string().trim().min(1).max(100).nullable(),
  deadline: timestampSchema.nullable(),
  description: z.string().trim().min(1).max(50_000),
})

export const competitionSearchParamsSchema = z.object({
  keywords: z.array(keywordSchema).min(1).max(3),
})

export const competitionSearchQuerySchema = z.object({
  keywords: z
    .string()
    .transform((keywords) =>
      keywords
        .split(',')
        .map((keyword) => keyword.trim())
        .filter((keyword) => keyword.length > 0),
    )
    .pipe(competitionSearchParamsSchema.shape.keywords),
})

export const competitionsResponseSchema = z.object({
  competitions: z.array(competitionSchema).max(20),
})

export const competitionDetailParamsSchema = z.object({
  id: identifierSchema,
})

export const competitionResponseSchema = z.object({
  competition: competitionSchema,
})

export const deleteResponseSchema = z.object({
  id: identifierSchema,
})

export type HealthStatus = z.infer<typeof healthStatusSchema>
export type Profile = z.infer<typeof profileSchema>
export type ProfileResponse = z.infer<typeof profileResponseSchema>
export type UpdateProfileRequest = z.infer<typeof updateProfileRequestSchema>
export type UpdateProfileResponse = z.infer<typeof updateProfileResponseSchema>
export type SavedQuery = z.infer<typeof savedQuerySchema>
export type SavedQueriesResponse = z.infer<typeof savedQueriesResponseSchema>
export type CreateSavedQueryRequest = z.infer<
  typeof createSavedQueryRequestSchema
>
export type CreateSavedQueryResponse = z.infer<
  typeof createSavedQueryResponseSchema
>
export type DeleteSavedQueryParams = z.infer<
  typeof deleteSavedQueryParamsSchema
>
export type Favorite = z.infer<typeof favoriteSchema>
export type FavoritesResponse = z.infer<typeof favoritesResponseSchema>
export type CreateFavoriteRequest = z.infer<typeof createFavoriteRequestSchema>
export type CreateFavoriteResponse = z.infer<
  typeof createFavoriteResponseSchema
>
export type DeleteFavoriteParams = z.infer<typeof deleteFavoriteParamsSchema>
export type Competition = z.infer<typeof competitionSchema>
export type CompetitionSearchParams = z.infer<
  typeof competitionSearchParamsSchema
>
export type CompetitionSearchQuery = z.infer<
  typeof competitionSearchQuerySchema
>
export type CompetitionsResponse = z.infer<typeof competitionsResponseSchema>
export type CompetitionDetailParams = z.infer<
  typeof competitionDetailParamsSchema
>
export type CompetitionResponse = z.infer<typeof competitionResponseSchema>
export type DeleteResponse = z.infer<typeof deleteResponseSchema>
