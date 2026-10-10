import type {
  CompetitionCandidate,
  EnglishSearchKeyword,
} from '@/domain/competition-candidate'

export type CompetitionCatalog = {
  findById: (id: string) => Promise<CompetitionCandidate | null>
  searchByKeyword: (
    keyword: EnglishSearchKeyword,
  ) => Promise<CompetitionCandidate[]>
}
