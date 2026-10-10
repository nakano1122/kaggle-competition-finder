import {
  competitionsResponseSchema,
  createFavoriteResponseSchema,
  createSavedQueryResponseSchema,
  deleteResponseSchema,
  favoritesResponseSchema,
  profileResponseSchema,
  updateProfileResponseSchema,
  savedQueriesResponseSchema,
} from '@kaggle-competition-finder/schemas'
import type {
  Competition,
  Favorite,
  SavedQuery,
} from '@kaggle-competition-finder/schemas'
import { useEffect, useRef, useState } from 'react'

type PipelineStage =
  'query' | 'keywords' | 'candidates' | 'reranking' | 'summary'

type RequestOptions = {
  method?: 'DELETE' | 'POST' | 'PUT'
  body?: unknown
}

const initialProfile =
  '情報検索モデルの研究に取り組んでおり、Dense RetrievalやRerankingモデルの実装経験がある。PythonとPyTorchを用いた機械学習モデルの開発・評価経験がある。'

const initialQuery =
  '自然言語処理や情報検索の経験を活用できるKaggleコンペを探したい。特に、テキスト分類や文書の関連度予測などのタスクに興味がある。'

const mockKeywords = [
  'natural language processing',
  'text classification',
  'semantic similarity',
]

const pipelineSteps: Array<{
  id: PipelineStage
  label: string
  description: string
}> = [
  { id: 'query', label: '検索意図', description: '日本語クエリを確認' },
  { id: 'keywords', label: 'キーワード', description: '英語キーワードを準備' },
  { id: 'candidates', label: '候補取得', description: 'Kaggle APIを検索' },
  { id: 'reranking', label: '並び替え', description: '関連度で再順位付け' },
  { id: 'summary', label: '要約', description: '候補を日本語で整理' },
]

async function request<T>(
  path: string,
  parse: (value: unknown) => T,
  options: RequestOptions = {},
): Promise<T> {
  const response = await fetch(`/api${path}`, {
    method: options.method,
    headers: options.body ? { 'Content-Type': 'application/json' } : undefined,
    body: options.body ? JSON.stringify(options.body) : undefined,
  })

  if (!response.ok) {
    throw new Error(
      'データを取得できませんでした。しばらくしてからもう一度お試しください。',
    )
  }

  return parse(await response.json())
}

function formatDate(value: string | null) {
  if (!value) {
    return '未定'
  }

  const date = new Date(value)
  if (Number.isNaN(date.getTime())) {
    return value
  }

  return new Intl.DateTimeFormat('ja-JP', { dateStyle: 'medium' }).format(date)
}

function stageIndex(stage: PipelineStage | null) {
  return stage ? pipelineSteps.findIndex((step) => step.id === stage) : -1
}

function summarizeCompetition(competition: Competition) {
  return `「${competition.description}」を対象としたコンペです。実際の詳細はKaggleの公式ページで確認してください。`
}

function explainRelevance(competition: Competition, query: string) {
  const task = competition.category ?? '機械学習'
  const focus =
    query.includes('検索') || query.includes('テキスト')
      ? 'テキストや関連度の扱い'
      : '機械学習の課題設定'
  return `${task}の課題で、入力された実績にある${focus}を活かせる可能性があります。これはモック画面上の推薦理由です。`
}

function Pipeline({
  activeStage,
  isSearching,
}: {
  activeStage: PipelineStage | null
  isSearching: boolean
}) {
  const activeIndex = stageIndex(activeStage)

  return (
    <ol aria-label="検索の進捗" className="pipeline">
      {pipelineSteps.map((step, index) => {
        const isCurrent = isSearching && index === activeIndex
        const isComplete = !isSearching || index < activeIndex
        const state = isCurrent
          ? 'current'
          : isComplete
            ? 'complete'
            : 'pending'

        return (
          <li className={`pipeline-step pipeline-step-${state}`} key={step.id}>
            <span aria-hidden="true" className="pipeline-number">
              {isComplete ? '✓' : index + 1}
            </span>
            <span>
              <strong>{step.label}</strong>
              <small>{step.description}</small>
            </span>
          </li>
        )
      })}
    </ol>
  )
}

function CompetitionCard({
  competition,
  isFavorite,
  query,
  onToggleFavorite,
}: {
  competition: Competition
  isFavorite: boolean
  query: string
  onToggleFavorite: (competition: Competition) => void
}) {
  return (
    <article className="competition-card">
      <div className="competition-card-heading">
        <div>
          <p className="eyebrow">{competition.category ?? 'Uncategorized'}</p>
          <h3>{competition.title}</h3>
        </div>
        <span className="score">モック候補</span>
      </div>

      <dl className="competition-facts">
        <div>
          <dt>締切</dt>
          <dd>{formatDate(competition.deadline)}</dd>
        </div>
        <div>
          <dt>コンペ概要</dt>
          <dd>{competition.description}</dd>
        </div>
      </dl>

      <section aria-label="日本語要約" className="summary">
        <h4>日本語要約（モック）</h4>
        <p>{summarizeCompetition(competition)}</p>
      </section>

      <section aria-label="推薦理由" className="reason">
        <h4>実績との関連性（モック）</h4>
        <p>{explainRelevance(competition, query)}</p>
      </section>

      <div className="card-actions">
        <a href={competition.url} rel="noreferrer" target="_blank">
          Kaggleで見る <span aria-hidden="true">↗</span>
        </a>
        <button
          aria-pressed={isFavorite}
          className={
            isFavorite
              ? 'button button-secondary active'
              : 'button button-secondary'
          }
          onClick={() => onToggleFavorite(competition)}
          type="button"
        >
          {isFavorite ? 'お気に入りから外す' : 'お気に入りに追加'}
        </button>
      </div>
    </article>
  )
}

export function App() {
  const [profile, setProfile] = useState(initialProfile)
  const [query, setQuery] = useState(initialQuery)
  const [savedQueries, setSavedQueries] = useState<SavedQuery[]>([])
  const [favorites, setFavorites] = useState<Favorite[]>([])
  const [competitions, setCompetitions] = useState<Competition[]>([])
  const [activeStage, setActiveStage] = useState<PipelineStage | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isSavingProfile, setIsSavingProfile] = useState(false)
  const [isSavingQuery, setIsSavingQuery] = useState(false)
  const [isSearching, setIsSearching] = useState(false)
  const [error, setError] = useState('')
  const searchVersion = useRef(0)

  async function loadInitialData() {
    try {
      const [profileData, queryData, favoriteData] = await Promise.all([
        request('/profile', profileResponseSchema.parse),
        request('/queries', savedQueriesResponseSchema.parse),
        request('/favorites', favoritesResponseSchema.parse),
      ])

      if (profileData.profile) {
        setProfile(profileData.profile.content)
      }
      setSavedQueries(queryData.queries)
      setFavorites(favoriteData.favorites)
    } catch (requestError) {
      setError(
        requestError instanceof Error
          ? requestError.message
          : '初期データを取得できませんでした。',
      )
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      void loadInitialData()
    })

    return () => window.clearTimeout(timeoutId)
  }, [])

  async function saveProfile() {
    if (!profile.trim()) {
      setError('実績を入力してください。')
      return
    }

    setIsSavingProfile(true)
    setError('')
    try {
      await request('/profile', updateProfileResponseSchema.parse, {
        method: 'PUT',
        body: { content: profile.trim() },
      })
    } catch (requestError) {
      setError(
        requestError instanceof Error
          ? requestError.message
          : '実績を保存できませんでした。',
      )
    } finally {
      setIsSavingProfile(false)
    }
  }

  async function saveQuery() {
    if (!query.trim()) {
      setError('保存する検索クエリを入力してください。')
      return
    }

    setIsSavingQuery(true)
    setError('')
    try {
      const response = await request(
        '/queries',
        createSavedQueryResponseSchema.parse,
        {
          method: 'POST',
          body: { query: query.trim() },
        },
      )
      setSavedQueries((currentQueries) => [response.query, ...currentQueries])
    } catch (requestError) {
      setError(
        requestError instanceof Error
          ? requestError.message
          : '検索クエリを保存できませんでした。',
      )
    } finally {
      setIsSavingQuery(false)
    }
  }

  async function deleteQuery(id: string) {
    try {
      await request(`/queries/${id}`, deleteResponseSchema.parse, {
        method: 'DELETE',
      })
      setSavedQueries((currentQueries) =>
        currentQueries.filter((savedQuery) => savedQuery.id !== id),
      )
    } catch (requestError) {
      setError(
        requestError instanceof Error
          ? requestError.message
          : '保存済みクエリを削除できませんでした。',
      )
    }
  }

  async function search() {
    if (!query.trim()) {
      setError('検索クエリを入力してください。')
      return
    }

    const version = searchVersion.current + 1
    searchVersion.current = version
    setError('')
    setIsSearching(true)
    setActiveStage('keywords')

    try {
      setActiveStage('candidates')
      const keywords = mockKeywords.join(',')
      const response = await request(
        `/competitions?keywords=${encodeURIComponent(keywords)}`,
        competitionsResponseSchema.parse,
      )

      if (searchVersion.current !== version) {
        return
      }

      setActiveStage('reranking')
      setCompetitions(response.competitions)
      setActiveStage('summary')
    } catch (requestError) {
      if (searchVersion.current === version) {
        setError(
          requestError instanceof Error
            ? requestError.message
            : 'コンペを検索できませんでした。',
        )
        setCompetitions([])
      }
    } finally {
      if (searchVersion.current === version) {
        setIsSearching(false)
      }
    }
  }

  async function toggleFavorite(competition: Competition) {
    const favorite = favorites.find(
      (item) => item.competitionId === competition.id,
    )

    try {
      if (favorite) {
        await request(
          `/favorites/${competition.id}`,
          deleteResponseSchema.parse,
          { method: 'DELETE' },
        )
        setFavorites((currentFavorites) =>
          currentFavorites.filter(
            (item) => item.competitionId !== competition.id,
          ),
        )
        return
      }

      const response = await request(
        '/favorites',
        createFavoriteResponseSchema.parse,
        {
          method: 'POST',
          body: {
            competitionId: competition.id,
            title: competition.title,
            url: competition.url,
          },
        },
      )
      setFavorites((currentFavorites) => [
        response.favorite,
        ...currentFavorites,
      ])
    } catch (requestError) {
      setError(
        requestError instanceof Error
          ? requestError.message
          : 'お気に入りを更新できませんでした。',
      )
    }
  }

  const resultMessage = isSearching
    ? 'モックAPIから候補を取得しています。重量級のモデルはこの画面では読み込みません。'
    : competitions.length > 0
      ? `${competitions.length}件の候補を表示しています。関連度の再順位付けは後続のブラウザ内推論で置き換えます。`
      : '検索すると、モックAPIの候補とモック要約をここに表示します。'

  return (
    <main className="page-shell">
      <header className="hero">
        <p className="product-name">Kaggle Competition Finder</p>
        <h1>経験を活かせる、次のコンペを見つける。</h1>
        <p>
          実績から検索意図を整え、候補の情報と日本語要約をまとめて確認できます。
        </p>
      </header>

      {error ? (
        <div className="notice notice-error" role="alert">
          {error}
        </div>
      ) : null}

      <div className="workspace">
        <div className="main-column">
          <section aria-labelledby="profile-heading" className="panel">
            <div className="section-heading">
              <div>
                <p className="section-number">01</p>
                <h2 id="profile-heading">研究・開発実績</h2>
              </div>
              <span className="section-note">検索の出発点</span>
            </div>
            <label className="sr-only" htmlFor="profile">
              研究・開発実績
            </label>
            <textarea
              id="profile"
              onChange={(event) => setProfile(event.target.value)}
              rows={6}
              value={profile}
            />
            <div className="panel-footer">
              <p>専門領域、使った技術、取り組みたい課題を自由に書けます。</p>
              <button
                className="button button-secondary"
                disabled={isSavingProfile}
                onClick={saveProfile}
                type="button"
              >
                {isSavingProfile ? '保存中…' : '実績を保存'}
              </button>
            </div>
          </section>

          <section aria-labelledby="query-heading" className="panel">
            <div className="section-heading">
              <div>
                <p className="section-number">02</p>
                <h2 id="query-heading">検索クエリ</h2>
              </div>
              <span className="section-note">自由に編集できます</span>
            </div>
            <label className="sr-only" htmlFor="query">
              検索クエリ
            </label>
            <textarea
              id="query"
              onChange={(event) => setQuery(event.target.value)}
              rows={4}
              value={query}
            />
            <div className="query-actions">
              <button
                className="button button-primary"
                disabled={isSearching}
                onClick={search}
                type="button"
              >
                {isSearching ? '検索中…' : 'コンペを検索'}
              </button>
              <button
                className="button button-quiet"
                disabled={isSavingQuery}
                onClick={saveQuery}
                type="button"
              >
                {isSavingQuery ? '保存中…' : 'このクエリを保存'}
              </button>
            </div>
          </section>

          <section
            aria-labelledby="progress-heading"
            className="panel progress-panel"
          >
            <div className="section-heading">
              <div>
                <p className="section-number">03</p>
                <h2 id="progress-heading">検索の進捗</h2>
              </div>
              <span
                className={isSearching ? 'status status-running' : 'status'}
              >
                {isSearching ? '処理中' : '待機中'}
              </span>
            </div>
            <Pipeline activeStage={activeStage} isSearching={isSearching} />
            {activeStage ? (
              <p className="keyword-row">
                <span>検索キーワード</span>
                {mockKeywords.map((keyword) => (
                  <code key={keyword}>{keyword}</code>
                ))}
              </p>
            ) : null}
          </section>

          <section
            aria-labelledby="results-heading"
            className="results-section"
          >
            <div className="results-heading">
              <div>
                <p className="section-number">04</p>
                <h2 id="results-heading">検索結果</h2>
              </div>
              <p aria-live="polite">{resultMessage}</p>
            </div>
            {competitions.length > 0 ? (
              <div className="competition-list">
                {competitions.map((competition) => (
                  <CompetitionCard
                    competition={competition}
                    isFavorite={favorites.some(
                      (favorite) => favorite.competitionId === competition.id,
                    )}
                    key={competition.id}
                    onToggleFavorite={toggleFavorite}
                    query={query}
                  />
                ))}
              </div>
            ) : (
              <div className="empty-state">
                <p>まだ検索結果はありません。</p>
                <span>
                  実績や興味のある課題をもとに、検索クエリを編集してみてください。
                </span>
              </div>
            )}
          </section>
        </div>

        <aside aria-labelledby="saved-heading" className="side-column">
          <section className="side-panel">
            <div className="side-heading">
              <div>
                <p className="section-number">SAVED</p>
                <h2 id="saved-heading">保存済みクエリ</h2>
              </div>
              <span>{savedQueries.length}</span>
            </div>
            {isLoading ? <p className="loading-copy">読み込み中…</p> : null}
            {!isLoading && savedQueries.length === 0 ? (
              <p className="empty-copy">
                今の検索クエリを保存すると、ここから再利用できます。
              </p>
            ) : null}
            <ul className="saved-list">
              {savedQueries.map((savedQuery) => (
                <li key={savedQuery.id}>
                  <button
                    onClick={() => setQuery(savedQuery.query)}
                    type="button"
                  >
                    {savedQuery.query}
                  </button>
                  <div>
                    <time dateTime={savedQuery.createdAt}>
                      {formatDate(savedQuery.createdAt)}
                    </time>
                    <button
                      aria-label="保存済みクエリを削除"
                      className="delete-button"
                      onClick={() => void deleteQuery(savedQuery.id)}
                      type="button"
                    >
                      削除
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          </section>

          <section
            aria-labelledby="favorite-heading"
            className="side-panel favorite-panel"
          >
            <div className="side-heading">
              <div>
                <p className="section-number">FAVORITES</p>
                <h2 id="favorite-heading">お気に入り</h2>
              </div>
              <span>{favorites.length}</span>
            </div>
            {!isLoading && favorites.length === 0 ? (
              <p className="empty-copy">
                気になるコンペを保存して、あとから見比べられます。
              </p>
            ) : null}
            <ul className="favorite-list">
              {favorites.map((favorite) => (
                <li key={favorite.competitionId}>
                  <a href={favorite.url} rel="noreferrer" target="_blank">
                    {favorite.title}
                  </a>
                  <time dateTime={favorite.createdAt}>
                    {formatDate(favorite.createdAt)}
                  </time>
                </li>
              ))}
            </ul>
          </section>
        </aside>
      </div>
    </main>
  )
}
