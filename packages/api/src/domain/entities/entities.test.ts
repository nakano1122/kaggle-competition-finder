import { describe, expect, it } from 'vitest'
import {
  createCompetitionCandidate,
  createFavoriteCompetition,
  createResearchAndDevelopmentExperience,
  createSavedSearchQuery,
} from '@/domain/entities'

describe('研究・開発実績', () => {
  it('内容の前後の空白を除いて作成する', () => {
    expect(
      createResearchAndDevelopmentExperience({
        content: '  情報検索モデルを研究している。  ',
        updatedAt: '2026-10-11T00:00:00.000Z',
      }),
    ).toEqual({
      content: '情報検索モデルを研究している。',
      updatedAt: '2026-10-11T00:00:00.000Z',
    })
  })

  it('空白だけの内容は作成しない', () => {
    expect(
      createResearchAndDevelopmentExperience({
        content: ' ',
        updatedAt: '2026-10-11T00:00:00.000Z',
      }),
    ).toBeUndefined()
  })
})

describe('保存済み検索クエリ', () => {
  it('IDとクエリを正規化して作成する', () => {
    expect(
      createSavedSearchQuery({
        id: ' query-1 ',
        query: ' 自然言語処理のコンペ ',
        createdAt: '2026-10-11T00:00:00.000Z',
      }),
    ).toEqual({
      id: 'query-1',
      query: '自然言語処理のコンペ',
      createdAt: '2026-10-11T00:00:00.000Z',
    })
  })

  it('空白だけのIDまたはクエリは作成しない', () => {
    expect(
      createSavedSearchQuery({
        id: ' ',
        query: '自然言語処理のコンペ',
        createdAt: '2026-10-11T00:00:00.000Z',
      }),
    ).toBeUndefined()
    expect(
      createSavedSearchQuery({
        id: 'query-1',
        query: ' ',
        createdAt: '2026-10-11T00:00:00.000Z',
      }),
    ).toBeUndefined()
  })
})

describe('お気に入りコンペ', () => {
  it('識別子、名前、URLを正規化して作成する', () => {
    expect(
      createFavoriteCompetition({
        competitionId: ' us-patent-phrase-to-phrase-matching ',
        title: ' U.S. Patent Phrase to Phrase Matching ',
        url: ' https://www.kaggle.com/competitions/us-patent-phrase-to-phrase-matching ',
        createdAt: '2026-10-11T00:00:00.000Z',
      }),
    ).toEqual({
      competitionId: 'us-patent-phrase-to-phrase-matching',
      title: 'U.S. Patent Phrase to Phrase Matching',
      url: 'https://www.kaggle.com/competitions/us-patent-phrase-to-phrase-matching',
      createdAt: '2026-10-11T00:00:00.000Z',
    })
  })

  it('必須項目が空白だけなら作成しない', () => {
    expect(
      createFavoriteCompetition({
        competitionId: 'competition',
        title: ' ',
        url: 'https://www.kaggle.com/competitions/competition',
        createdAt: '2026-10-11T00:00:00.000Z',
      }),
    ).toBeUndefined()
  })
})

describe('コンペ候補', () => {
  it('必須項目と任意のカテゴリを正規化して作成する', () => {
    expect(
      createCompetitionCandidate({
        id: ' text-classification ',
        title: ' Text Classification ',
        url: ' https://www.kaggle.com/competitions/text-classification ',
        category: ' ',
        deadline: null,
        description: ' Classify text. ',
      }),
    ).toEqual({
      id: 'text-classification',
      title: 'Text Classification',
      url: 'https://www.kaggle.com/competitions/text-classification',
      category: null,
      deadline: null,
      description: 'Classify text.',
    })
  })

  it('説明が空白だけなら作成しない', () => {
    expect(
      createCompetitionCandidate({
        id: 'text-classification',
        title: 'Text Classification',
        url: 'https://www.kaggle.com/competitions/text-classification',
        category: null,
        deadline: null,
        description: ' ',
      }),
    ).toBeUndefined()
  })
})
