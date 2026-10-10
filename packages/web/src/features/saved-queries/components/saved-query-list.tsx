import { formatDate } from '@/lib/format-date'
import { SectionHeading } from '@/components/section-heading'
import type { SavedQuery } from '@kaggle-competition-finder/schemas'

type SavedQueryListProps = {
  onDelete: (id: string) => void
  onSelect: (query: string) => void
  savedQueries: SavedQuery[]
}

export function SavedQueryList({
  onDelete,
  onSelect,
  savedQueries,
}: SavedQueryListProps) {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <SectionHeading number="SAVED" title="保存済みクエリ">
        <span className="rounded-full bg-slate-100 px-3 py-1 text-sm font-semibold text-slate-600">
          {savedQueries.length}
        </span>
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
              <button
                className="text-left text-sm font-medium leading-6 text-slate-800 hover:text-indigo-700"
                onClick={() => onSelect(savedQuery.query)}
                type="button"
              >
                {savedQuery.query}
              </button>
              <div className="mt-2 flex items-center justify-between gap-3 text-xs text-slate-500">
                <time dateTime={savedQuery.createdAt}>
                  {formatDate(savedQuery.createdAt)}
                </time>
                <button
                  aria-label="保存済みクエリを削除"
                  className="font-medium text-rose-700 hover:text-rose-800"
                  onClick={() => onDelete(savedQuery.id)}
                  type="button"
                >
                  削除
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </section>
  )
}
