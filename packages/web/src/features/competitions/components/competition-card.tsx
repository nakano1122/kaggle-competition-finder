import { formatDate } from '@/lib/format-date'
import { Badge } from '@/components/shadcn-ui/badge'
import { Button } from '@/components/shadcn-ui/button'
import { Card } from '@/components/shadcn-ui/card'
import type { Competition } from '@schemas'
import Link from 'next/link'

type CompetitionCardProps = {
  competition: Competition
  isFavorite: boolean
  onToggleFavorite: (competition: Competition) => void
  query: string
}

const summarizeCompetition = (competition: Competition) => {
  return `「${competition.description}」を対象としたコンペです。実際の詳細はKaggleの公式ページで確認してください。`
}

const explainRelevance = (competition: Competition, query: string) => {
  const task = competition.category ?? '機械学習'
  const focus =
    query.includes('検索') || query.includes('テキスト')
      ? 'テキストや関連度の扱い'
      : '機械学習の課題設定'

  return `${task}の課題で、入力された実績にある${focus}を活かせる可能性があります。これはモック画面上の推薦理由です。`
}

export const CompetitionCard = ({
  competition,
  isFavorite,
  onToggleFavorite,
  query,
}: CompetitionCardProps) => {
  return (
    <article>
      <Card className="gap-5 rounded-2xl border-stone-200 bg-white p-6 shadow-sm">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="grid min-w-0 flex-1 basis-0 gap-2">
            <p className="text-xs font-semibold tracking-[0.14em] text-amber-800">
              {competition.category ?? 'Uncategorized'}
            </p>
            <h3 className="break-words text-xl font-semibold text-stone-950">
              {competition.title}
            </h3>
          </div>
          <Badge className="bg-amber-50 text-amber-800" variant="secondary">
            モック候補
          </Badge>
        </div>
        <dl className="grid gap-4 text-sm leading-6 text-stone-700">
          <div>
            <dt className="font-semibold text-stone-950">締切</dt>
            <dd>{formatDate(competition.deadline)}</dd>
          </div>
          <div>
            <dt className="font-semibold text-stone-950">コンペ概要</dt>
            <dd className="break-words">{competition.description}</dd>
          </div>
        </dl>
        <section
          className="grid gap-2 rounded-xl bg-stone-50 p-4"
          aria-label="日本語要約"
        >
          <h4 className="font-semibold text-stone-950">日本語要約（モック）</h4>
          <p className="text-sm leading-6 text-stone-700">
            {summarizeCompetition(competition)}
          </p>
        </section>
        <section
          className="grid gap-2 rounded-xl bg-amber-50 p-4"
          aria-label="推薦理由"
        >
          <h4 className="font-semibold text-stone-950">
            実績との関連性（モック）
          </h4>
          <p className="text-sm leading-6 text-stone-700">
            {explainRelevance(competition, query)}
          </p>
        </section>
        <div className="flex flex-wrap gap-3">
          <Button
            asChild
            className="font-semibold text-amber-800 hover:bg-amber-50"
            variant="ghost"
          >
            <Link href={competition.url} rel="noreferrer" target="_blank">
              Kaggleで見る <span aria-hidden="true">↗</span>
            </Link>
          </Button>
          <Button
            aria-pressed={isFavorite}
            className="border-stone-300 font-semibold text-stone-700 hover:bg-stone-50"
            onClick={() => onToggleFavorite(competition)}
            type="button"
            variant="outline"
          >
            {isFavorite ? 'お気に入りから外す' : 'お気に入りに追加'}
          </Button>
        </div>
      </Card>
    </article>
  )
}
