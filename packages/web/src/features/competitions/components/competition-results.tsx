import { CompetitionCard } from './competition-card'
import { Card } from '@/components/shadcn-ui/card'
import type { Competition, Favorite } from '@kaggle-competition-finder/schemas'

type CompetitionResultsProps = {
  competitions: Competition[]
  favorites: Favorite[]
  isSearching: boolean
  onToggleFavorite: (competition: Competition) => void
  query: string
}

export const CompetitionResults = ({
  competitions,
  favorites,
  isSearching,
  onToggleFavorite,
  query,
}: CompetitionResultsProps) => {
  const resultMessage = isSearching
    ? '候補を検索しています。'
    : competitions.length > 0
      ? `${competitions.length}件の候補を表示しています。`
      : '検索した候補をここに表示します。'

  return (
    <section aria-labelledby="results-heading" className="grid gap-5">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h2
            className="text-xl font-semibold text-stone-950"
            id="results-heading"
          >
            検索結果
          </h2>
        </div>
        <p aria-live="polite" className="max-w-xl text-sm text-stone-600">
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
        <Card className="gap-2 rounded-2xl border-dashed border-stone-300 bg-white p-8 text-center">
          <p className="font-semibold text-stone-800">
            まだ検索結果はありません。
          </p>
          <span className="block text-sm leading-6 text-stone-600">
            経験や関心を検索クエリに書いて、検索してみてください。
          </span>
        </Card>
      )}
    </section>
  )
}
