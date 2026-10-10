export type CompetitionCandidate = {
  id: string
  title: string
  url: string
  category: string | null
  deadline: string | null
  description: string
}

export type CompetitionCandidateInput = CompetitionCandidate

export const createCompetitionCandidate = (
  input: CompetitionCandidateInput,
): CompetitionCandidate | undefined => {
  const id = input.id.trim()
  const title = input.title.trim()
  const url = input.url.trim()
  const description = input.description.trim()

  if (id.length === 0 || title.length === 0 || url.length === 0) {
    return undefined
  }

  if (description.length === 0) {
    return undefined
  }

  return {
    ...input,
    id,
    title,
    url,
    description,
    category: input.category?.trim() || null,
  }
}
