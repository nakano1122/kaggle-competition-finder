import { Hono } from 'hono'
import { zValidator } from '@hono/zod-validator'
import {
  competitionDetailParamsSchema,
  competitionSearchQuerySchema,
  createFavoriteRequestSchema,
  createSavedQueryRequestSchema,
  deleteFavoriteParamsSchema,
  deleteSavedQueryParamsSchema,
  updateProfileRequestSchema,
} from '@kaggle-competition-finder/schemas'
import type {
  Competition,
  Favorite,
  Profile,
  SavedQuery,
} from '@kaggle-competition-finder/schemas'

type MockStore = {
  profile: Profile | null
  queries: SavedQuery[]
  favorites: Favorite[]
  competitions: Competition[]
  nextQueryId: number
}

const competitionData: Competition[] = [
  {
    id: 'learning-agency-lab-automated-essay-scoring-2',
    title: 'Learning Agency Lab - Automated Essay Scoring 2.0',
    url: 'https://www.kaggle.com/competitions/learning-agency-lab-automated-essay-scoring-2',
    category: 'Natural Language Processing',
    deadline: '2026-12-31T23:59:00.000Z',
    description:
      'Build models that assess student writing quality from essays. The task focuses on text regression and language understanding.',
  },
  {
    id: 'us-patent-phrase-to-phrase-matching',
    title: 'U.S. Patent Phrase to Phrase Matching',
    url: 'https://www.kaggle.com/competitions/us-patent-phrase-to-phrase-matching',
    category: 'Natural Language Processing',
    deadline: null,
    description:
      'Predict the semantic similarity between a patent phrase and another phrase in its context.',
  },
  {
    id: 'llm-science-exam',
    title: 'LLM Science Exam',
    url: 'https://www.kaggle.com/competitions/kaggle-llm-science-exam',
    category: 'Question Answering',
    deadline: null,
    description:
      'Select the correct answer to multiple-choice science questions with language models and information retrieval.',
  },
  {
    id: 'home-data-for-ml-course',
    title: 'Housing Prices Prediction',
    url: 'https://www.kaggle.com/competitions/home-data-for-ml-course',
    category: 'Tabular Regression',
    deadline: null,
    description:
      'Predict house prices from tabular features. This competition is suitable for learning regression workflows.',
  },
]

function createMockStore(): MockStore {
  return {
    profile: {
      content:
        '情報検索と自然言語処理の研究に取り組み、Dense Retrieval と Reranking モデルを実装してきた。',
      updatedAt: '2026-10-10T00:00:00.000Z',
    },
    queries: [
      {
        id: 'query-1',
        query: '自然言語処理や情報検索の経験を活用できるコンペを探したい。',
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
    competitions: competitionData,
    nextQueryId: 2,
  }
}

function findCompetition(
  competitions: Competition[],
  competitionId: string,
): Competition | undefined {
  return competitions.find((competition) => competition.id === competitionId)
}

function searchCompetitions(
  competitions: Competition[],
  keywords: string[],
): Competition[] {
  const normalizedKeywords = keywords.map((keyword) => keyword.toLowerCase())

  return competitions.filter((competition) => {
    const searchableText = [
      competition.title,
      competition.category,
      competition.description,
    ]
      .filter((text) => text !== null)
      .join(' ')
      .toLowerCase()

    return normalizedKeywords.some((keyword) =>
      searchableText.includes(keyword),
    )
  })
}

function notFound(message: string) {
  return { error: message }
}

export function createApp(store = createMockStore()) {
  const app = new Hono()

  app.get('/api/health', (context) => {
    return context.json({ status: 'ok' as const })
  })

  app.get('/api/profile', (context) => {
    return context.json({ profile: store.profile })
  })

  app.put(
    '/api/profile',
    zValidator('json', updateProfileRequestSchema),
    (context) => {
      const { content } = context.req.valid('json')
      const profile = { content, updatedAt: new Date().toISOString() }

      store.profile = profile

      return context.json({ profile })
    },
  )

  app.get('/api/queries', (context) => {
    return context.json({ queries: store.queries })
  })

  app.post(
    '/api/queries',
    zValidator('json', createSavedQueryRequestSchema),
    (context) => {
      const { query } = context.req.valid('json')
      const savedQuery = {
        id: `query-${store.nextQueryId}`,
        query,
        createdAt: new Date().toISOString(),
      }

      store.nextQueryId += 1
      store.queries.unshift(savedQuery)

      return context.json({ query: savedQuery }, 201)
    },
  )

  app.delete(
    '/api/queries/:id',
    zValidator('param', deleteSavedQueryParamsSchema),
    (context) => {
      const { id } = context.req.valid('param')
      const queryIndex = store.queries.findIndex((query) => query.id === id)

      if (queryIndex === -1) {
        return context.json(notFound('Saved query was not found.'), 404)
      }

      store.queries.splice(queryIndex, 1)

      return context.json({ id })
    },
  )

  app.get('/api/favorites', (context) => {
    return context.json({ favorites: store.favorites })
  })

  app.post(
    '/api/favorites',
    zValidator('json', createFavoriteRequestSchema),
    (context) => {
      const favorite = context.req.valid('json')
      const isAlreadyFavorite = store.favorites.some(
        (item) => item.competitionId === favorite.competitionId,
      )

      if (isAlreadyFavorite) {
        return context.json(
          { error: 'Competition is already a favorite.' },
          409,
        )
      }

      const savedFavorite = {
        ...favorite,
        createdAt: new Date().toISOString(),
      }

      store.favorites.unshift(savedFavorite)

      return context.json({ favorite: savedFavorite }, 201)
    },
  )

  app.delete(
    '/api/favorites/:id',
    zValidator('param', deleteFavoriteParamsSchema),
    (context) => {
      const { id } = context.req.valid('param')
      const favoriteIndex = store.favorites.findIndex(
        (favorite) => favorite.competitionId === id,
      )

      if (favoriteIndex === -1) {
        return context.json(notFound('Favorite was not found.'), 404)
      }

      store.favorites.splice(favoriteIndex, 1)

      return context.json({ id })
    },
  )

  app.get(
    '/api/competitions',
    zValidator('query', competitionSearchQuerySchema),
    (context) => {
      const { keywords } = context.req.valid('query')
      const competitions = searchCompetitions(store.competitions, keywords)

      return context.json({ competitions })
    },
  )

  app.get(
    '/api/competitions/:id',
    zValidator('param', competitionDetailParamsSchema),
    (context) => {
      const { id } = context.req.valid('param')
      const competition = findCompetition(store.competitions, id)

      if (competition === undefined) {
        return context.json(notFound('Competition was not found.'), 404)
      }

      return context.json({ competition })
    },
  )

  return app
}

export const app = createApp()

export default app
