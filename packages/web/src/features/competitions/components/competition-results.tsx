import { CompetitionCard } from './competition-card'
import type { Competition, Favorite } from '@kaggle-competition-finder/schemas'

type CompetitionResultsProps = {
  competitions: Competition[]
  favorites: Favorite[]
  isSearching: boolean
  onToggleFavorite: (competition: Competition) => void
  query: string
}

export function CompetitionResults({
  competitions,
  favorites,
  isSearching,
  onToggleFavorite,
  query,
}: CompetitionResultsProps) {
  const resultMessage = isSearching
    ? 'モックAPIから候補を取得しています。重量級のモデルはこの画面では読み込みません。'
    : competitions.length > 0
      ? `${competitions.length}件の候補を表示しています。関連度の再順位付けは後続のブラウザ内推論で置き換えます。`
      : '検索すると、モックAPIの候補とモック要約をここに表示します。'

  return (
    <section aria-labelledby="results-heading">
      <div className="mb-5 flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="text-xs font-semibold tracking-[0.16em] text-slate-500">
            04
          </p>
          <h2
            className="mt-1 text-xl font-semibold text-slate-950"
            id="results-heading"
          >
            検索結果
          </h2>
        </div>
        <p aria-live="polite" className="max-w-xl text-sm text-slate-500">
          {resultMessage}
        </p>
      </div>
      {competitions.length > 0 ? (
        <div className="grid gap-4">
          {competitions.map((competition) => (
            <CompetitionCard
              competition={competition}
              isFavorite={favorites.some(
                (favorite) => favorite.competitionId === competition.id,
              )}
              key={competition.id}
              onToggleFavorite={onToggleFavorite}
              query={query}
            />
          ))}
        </div>
      ) : (
        <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-8 text-center">
          <p className="font-semibold text-slate-800">
            まだ検索結果はありません。
          </p>
          <span className="mt-2 block text-sm leading-6 text-slate-500">
            実績や興味のある課題をもとに、検索クエリを編集してみてください。
          </span>
        </div>
      )}
    </section>
  )
}
