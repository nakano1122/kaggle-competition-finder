export type FavoriteCompetition = {
  competitionId: string
  title: string
  url: string
  createdAt: string
}

export type FavoriteCompetitionInput = FavoriteCompetition

export const createFavoriteCompetition = (
  input: FavoriteCompetitionInput,
): FavoriteCompetition | undefined => {
  const competitionId = input.competitionId.trim()
  const title = input.title.trim()
  const url = input.url.trim()

  if (competitionId.length === 0 || title.length === 0 || url.length === 0) {
    return undefined
  }

  return { ...input, competitionId, title, url }
}
