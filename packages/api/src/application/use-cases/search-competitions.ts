import {
  createEnglishSearchKeywords,
  deduplicateCompetitionCandidates,
} from '@/domain/competition-candidate'
import type { CompetitionCandidate } from '@/domain/entities/competition-candidate'
import type { CompetitionCatalog } from '@/domain/services/competition-catalog'

const maximumCandidateCount = 20

export const getCompetition = (
  competitionId: string,
  catalog: CompetitionCatalog,
): Promise<CompetitionCandidate | null> => {
  return catalog.findById(competitionId)
}

export const searchCompetitions = async (
  keywordValues: string[],
  catalog: CompetitionCatalog,
): Promise<CompetitionCandidate[]> => {
  const keywords = createEnglishSearchKeywords(keywordValues)

  if (keywords === undefined) {
    return []
  }

  const candidateGroups = await Promise.all(
    keywords.map((keyword) => catalog.searchByKeyword(keyword)),
  )

  return deduplicateCompetitionCandidates(candidateGroups.flat()).slice(
    0,
    maximumCandidateCount,
  )
}
