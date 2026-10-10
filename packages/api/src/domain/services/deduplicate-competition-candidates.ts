import type { CompetitionCandidate } from '@/domain/entities/competition-candidate'

export const deduplicateCompetitionCandidates = (
  candidates: CompetitionCandidate[],
): CompetitionCandidate[] => {
  const competitionIds = new Set<string>()

  return candidates.filter((candidate) => {
    if (competitionIds.has(candidate.id)) {
      return false
    }

    competitionIds.add(candidate.id)

    return true
  })
}
