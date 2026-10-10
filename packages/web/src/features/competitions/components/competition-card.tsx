import { formatDate } from '@/lib/format-date'
import { Badge } from '@/components/shadcn-ui/badge'
import { Button } from '@/components/shadcn-ui/button'
import { Card } from '@/components/shadcn-ui/card'
import type { Competition } from '@kaggle-competition-finder/schemas'
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
      <Card className="gap-0 rounded-2xl border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-xs font-semibold tracking-[0.14em] text-indigo-700">
              {competition.category ?? 'Uncategorized'}
            </p>
            <h3 className="mt-2 text-xl font-semibold text-slate-950">
              {competition.title}
            </h3>
          </div>
          <Badge className="bg-indigo-50 text-indigo-700" variant="secondary">
            モック候補
          </Badge>
        </div>
        <dl className="mt-5 grid gap-4 text-sm leading-6 text-slate-700">
          <div>
            <dt className="font-semibold text-slate-950">締切</dt>
            <dd>{formatDate(competition.deadline)}</dd>
          </div>
          <div>
            <dt className="font-semibold text-slate-950">コンペ概要</dt>
            <dd>{competition.description}</dd>
          </div>
        </dl>
        <section
          className="mt-5 rounded-xl bg-slate-50 p-4"
          aria-label="日本語要約"
        >
          <h4 className="font-semibold text-slate-950">日本語要約（モック）</h4>
          <p className="mt-2 text-sm leading-6 text-slate-700">
            {summarizeCompetition(competition)}
          </p>
        </section>
        <section
          className="mt-3 rounded-xl bg-amber-50 p-4"
          aria-label="推薦理由"
        >
          <h4 className="font-semibold text-slate-950">
            実績との関連性（モック）
          </h4>
          <p className="mt-2 text-sm leading-6 text-slate-700">
            {explainRelevance(competition, query)}
          </p>
        </section>
        <div className="mt-5 flex flex-wrap gap-3">
          <Button
            asChild
            className="font-semibold text-indigo-700 hover:bg-indigo-50"
            variant="ghost"
          >
            <Link href={competition.url} rel="noreferrer" target="_blank">
              Kaggleで見る <span aria-hidden="true">↗</span>
            </Link>
          </Button>
          <Button
            aria-pressed={isFavorite}
            className="border-slate-300 font-semibold text-slate-700 hover:bg-slate-50"
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
