import type { Favorite } from '@kaggle-competition-finder/schemas'

export type InitialResultsData = {
  favorites: Favorite[]
}

export const initialResultsData: InitialResultsData = {
  favorites: [
    {
      competitionId: 'us-patent-phrase-to-phrase-matching',
      title: 'U.S. Patent Phrase to Phrase Matching',
      url: 'https://www.kaggle.com/competitions/us-patent-phrase-to-phrase-matching',
      createdAt: '2026-10-10T00:00:00.000Z',
    },
  ],
}
