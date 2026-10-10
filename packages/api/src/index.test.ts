import { describe, expect, it } from 'vitest'
import { competitionsResponseSchema } from '@schemas'
import { createApp } from '@/app'

describe('mock API', () => {
  it('updates and returns the profile', async () => {
    const app = createApp()

    const updateResponse = await app.request('/api/profile', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ content: '検索システムを開発した実績がある。' }),
    })
    const getResponse = await app.request('/api/profile')

    expect(updateResponse.status).toBe(200)
    await expect(getResponse.json()).resolves.toMatchObject({
      profile: { content: '検索システムを開発した実績がある。' },
    })
  })

  it('validates and manages saved queries', async () => {
    const app = createApp()

    const invalidResponse = await app.request('/api/queries', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query: '' }),
    })
    const createResponse = await app.request('/api/queries', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query: 'semantic similarity' }),
    })
    const deleteResponse = await app.request('/api/queries/query-2', {
      method: 'DELETE',
    })

    expect(invalidResponse.status).toBe(400)
    expect(createResponse.status).toBe(201)
    expect(deleteResponse.status).toBe(200)
  })

  it('searches competitions with comma-separated keywords', async () => {
    const app = createApp()

    const response = await app.request(
      '/api/competitions?keywords=natural%20language,semantic%20similarity',
    )
    const body = competitionsResponseSchema.parse(await response.json())

    expect(response.status).toBe(200)
    expect(body.competitions).toHaveLength(2)
  })

  it('returns a competition detail and manages favorites', async () => {
    const app = createApp()
    const competitionResponse = await app.request(
      '/api/competitions/llm-science-exam',
    )
    const favoriteResponse = await app.request('/api/favorites', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        competitionId: 'llm-science-exam',
        title: 'LLM Science Exam',
        url: 'https://www.kaggle.com/competitions/kaggle-llm-science-exam',
      }),
    })
    const deleteResponse = await app.request(
      '/api/favorites/llm-science-exam',
      { method: 'DELETE' },
    )

    expect(competitionResponse.status).toBe(200)
    expect(favoriteResponse.status).toBe(201)
    expect(deleteResponse.status).toBe(200)
  })
})
