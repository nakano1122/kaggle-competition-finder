import { describe, expect, it } from 'vitest'
import type { CompetitionCandidate } from '../../domain/competition-candidate'
import type { CompetitionCatalog } from '../../domain/services/competition-catalog'
import { searchCompetitions } from './search-competitions'

const createCandidate = (id: string): CompetitionCandidate => {
  return {
    id,
    title: id,
    url: `https://www.kaggle.com/competitions/${id}`,
    category: 'Natural Language Processing',
    deadline: null,
    description: `${id} competition`,
  }
}

const duplicateCandidate = createCandidate('duplicate')
const searchCandidates = Array.from({ length: 21 }, (_, index) => {
  return createCandidate(`competition-${index}`)
})

const catalog: CompetitionCatalog = {
  findById: () => Promise.resolve(null),
  searchByKeyword: (keyword) => {
    if (keyword.value === 'first') {
      return Promise.resolve([duplicateCandidate, ...searchCandidates])
    }

    return Promise.resolve([duplicateCandidate])
  },
}

describe('コンペ検索', () => {
  it('キーワードごとの候補をIDで重複排除し、最大20件に絞る', async () => {
    const competitions = await searchCompetitions(['first', 'second'], catalog)

    expect(competitions).toHaveLength(20)
    expect(competitions[0]?.id).toBe('duplicate')
    expect(
      competitions.filter((competition) => competition.id === 'duplicate'),
    ).toHaveLength(1)
  })
})
