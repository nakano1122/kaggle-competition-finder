import type { CompetitionCandidate } from '../../domain/competition-candidate'
import type { CompetitionCatalog } from '../../domain/services/competition-catalog'

const competitions: CompetitionCandidate[] = [
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

const searchCompetitionCandidates = (keyword: string) => {
  const normalizedKeyword = keyword.toLowerCase()

  return competitions.filter((competition) => {
    const searchableText = [
      competition.title,
      competition.category,
      competition.description,
    ]
      .filter((text) => text !== null)
      .join(' ')
      .toLowerCase()

    return searchableText.includes(normalizedKeyword)
  })
}

export const createMockKaggleCompetitionCatalog = (): CompetitionCatalog => {
  return {
    findById: (competitionId) => {
      const competition = competitions.find((item) => item.id === competitionId)
      return Promise.resolve(competition ?? null)
    },
    searchByKeyword: (keyword) => {
      return Promise.resolve(searchCompetitionCandidates(keyword.value))
    },
  }
}
