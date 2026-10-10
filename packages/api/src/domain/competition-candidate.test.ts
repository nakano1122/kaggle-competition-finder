import { describe, expect, it } from 'vitest'
import {
  createEnglishSearchKeyword,
  createEnglishSearchKeywords,
  deduplicateCompetitionCandidates,
} from '@/domain/competition-candidate'

describe('英語検索キーワード', () => {
  it('前後の空白を除いて作成する', () => {
    expect(
      createEnglishSearchKeyword('  natural language processing  '),
    ).toEqual({
      value: 'natural language processing',
    })
  })

  it('空白だけのキーワードは作成しない', () => {
    expect(createEnglishSearchKeyword('   ')).toBeUndefined()
  })

  it('最大3件のキーワードを作成する', () => {
    expect(
      createEnglishSearchKeywords([
        'natural language processing',
        'text classification',
        'semantic similarity',
      ]),
    ).toEqual([
      { value: 'natural language processing' },
      { value: 'text classification' },
      { value: 'semantic similarity' },
    ])
  })

  it('4件以上または空白だけを含むキーワード一覧は作成しない', () => {
    expect(createEnglishSearchKeywords(['a', 'b', 'c', 'd'])).toBeUndefined()
    expect(
      createEnglishSearchKeywords(['text classification', ' ']),
    ).toBeUndefined()
  })
})

describe('コンペ候補の重複排除', () => {
  it('コンペIDが重複する候補は最初の1件だけ残す', () => {
    const candidates = [
      {
        id: 'text-classification',
        title: 'Text Classification',
        url: 'https://www.kaggle.com/competitions/text-classification',
        category: 'Natural Language Processing',
        deadline: null,
        description: 'Classify text.',
      },
      {
        id: 'semantic-similarity',
        title: 'Semantic Similarity',
        url: 'https://www.kaggle.com/competitions/semantic-similarity',
        category: 'Natural Language Processing',
        deadline: null,
        description: 'Predict semantic similarity.',
      },
      {
        id: 'text-classification',
        title: 'Updated Text Classification',
        url: 'https://www.kaggle.com/competitions/text-classification',
        category: null,
        deadline: null,
        description: 'Another response for the same competition.',
      },
    ]

    expect(deduplicateCompetitionCandidates(candidates)).toEqual([
      candidates[0],
      candidates[1],
    ])
  })
})
