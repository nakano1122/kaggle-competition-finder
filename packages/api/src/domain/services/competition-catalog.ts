import type {
  CompetitionCandidate,
  EnglishSearchKeyword,
} from '../competition-candidate'

export type CompetitionCatalog = {
  findById: (id: string) => Promise<CompetitionCandidate | null>
  searchByKeyword: (
    keyword: EnglishSearchKeyword,
  ) => Promise<CompetitionCandidate[]>
}
