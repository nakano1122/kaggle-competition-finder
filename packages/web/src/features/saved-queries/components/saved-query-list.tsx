import { formatDate } from '@/lib/format-date'
import { SectionHeading } from '@/components/section-heading'
import { Badge } from '@/components/shadcn-ui/badge'
import { Button } from '@/components/shadcn-ui/button'
import { Card } from '@/components/shadcn-ui/card'
import type { SavedQuery } from '@kaggle-competition-finder/schemas'

type SavedQueryListProps = {
  onDelete: (id: string) => void
  onSelect: (query: string) => void
  savedQueries: SavedQuery[]
}

export const SavedQueryList = ({
  onDelete,
  onSelect,
  savedQueries,
}: SavedQueryListProps) => {
  return (
    <Card className="gap-0 rounded-2xl border-slate-200 bg-white p-5 shadow-sm">
      <SectionHeading number="SAVED" title="保存済みクエリ">
        <Badge
          className="bg-slate-100 px-3 py-1 text-sm text-slate-600"
          variant="secondary"
        >
          {savedQueries.length}
        </Badge>
      </SectionHeading>
      {savedQueries.length === 0 ? (
        <p className="text-sm leading-6 text-slate-500">
          今の検索クエリを保存すると、ここから再利用できます。
        </p>
      ) : (
        <ul className="grid gap-4">
          {savedQueries.map((savedQuery) => (
            <li
              className="border-b border-slate-100 pb-4 last:border-0 last:pb-0"
              key={savedQuery.id}
            >
              <Button
                className="h-auto justify-start p-0 text-left font-medium leading-6 text-slate-800 hover:text-indigo-700"
                onClick={() => onSelect(savedQuery.query)}
                type="button"
                variant="ghost"
              >
                {savedQuery.query}
              </Button>
              <div className="mt-2 flex items-center justify-between gap-3 text-xs text-slate-500">
                <time dateTime={savedQuery.createdAt}>
                  {formatDate(savedQuery.createdAt)}
                </time>
                <Button
                  aria-label="保存済みクエリを削除"
                  className="h-auto p-0 font-medium text-rose-700 hover:text-rose-800"
                  onClick={() => onDelete(savedQuery.id)}
                  type="button"
                  variant="ghost"
                >
                  削除
                </Button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </Card>
  )
}
