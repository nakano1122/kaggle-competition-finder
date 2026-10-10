import type {
  Favorite,
  Profile,
  SavedQuery,
} from '@kaggle-competition-finder/schemas'

export type InitialDashboardData = {
  favorites: Favorite[]
  profile: Profile
  savedQueries: SavedQuery[]
}

export const initialDashboardData: InitialDashboardData = {
  profile: {
    content:
      '情報検索モデルの研究に取り組んでおり、Dense RetrievalやRerankingモデルの実装経験がある。PythonとPyTorchを用いた機械学習モデルの開発・評価経験がある。',
    updatedAt: '2026-10-10T00:00:00.000Z',
  },
  savedQueries: [
    {
      id: 'query-1',
      query: '自然言語処理や情報検索の経験を活用できるKaggleコンペを探したい。',
      createdAt: '2026-10-10T00:00:00.000Z',
    },
  ],
  favorites: [
    {
      competitionId: 'us-patent-phrase-to-phrase-matching',
      title: 'U.S. Patent Phrase to Phrase Matching',
      url: 'https://www.kaggle.com/competitions/us-patent-phrase-to-phrase-matching',
      createdAt: '2026-10-10T00:00:00.000Z',
    },
  ],
}
