import { SectionHeading } from '@/components/section-heading'
import { Badge } from '@/components/shadcn-ui/badge'
import { Button } from '@/components/shadcn-ui/button'
import { Card } from '@/components/shadcn-ui/card'
import type { SearchHistoryItem } from '@/features/search/lib/search-history-storage'
import { formatDateTime } from '@/lib/format-date'

type SearchHistoryListProps = {
  onSelect: (id: string) => void
  searches: SearchHistoryItem[]
  selectedId: string | null
}

export const SearchHistoryList = ({
  onSelect,
  searches,
  selectedId,
}: SearchHistoryListProps) => {
  return (
    <Card className="gap-0 rounded-2xl border-stone-200 bg-white p-5 shadow-sm">
      <SectionHeading title="検索履歴">
        <Badge
          className="bg-stone-100 px-3 py-1 text-sm text-stone-700"
          variant="secondary"
        >
          {searches.length}
        </Badge>
      </SectionHeading>
      {searches.length === 0 ? (
        <p className="text-sm leading-6 text-stone-600">
          検索すると履歴がここに残り、いつでも候補に戻れます。
        </p>
      ) : (
        <ol className="grid gap-3">
          {searches.map((search) => {
            const isSelected = search.id === selectedId
            const resultLabel = `${search.competitions.length}件の候補`

            return (
              <li key={search.id}>
                <Button
                  aria-current={isSelected ? 'true' : undefined}
                  className="h-auto w-full justify-start rounded-xl border border-stone-200 bg-stone-50 p-3 text-left text-stone-800 hover:border-amber-300 hover:bg-amber-50 data-[current=true]:border-amber-500 data-[current=true]:bg-amber-50"
                  data-current={isSelected}
                  onClick={() => onSelect(search.id)}
                  type="button"
                  variant="ghost"
                >
                  <span className="grid w-full gap-2">
                    <span className="min-w-0 overflow-hidden break-words whitespace-normal line-clamp-2 font-medium leading-6">
                      {search.query}
                    </span>
                    <span className="flex flex-wrap items-center justify-between gap-3 text-xs font-normal text-stone-600">
                      <time
                        className="min-w-0 break-words"
                        dateTime={search.searchedAt}
                      >
                        {formatDateTime(search.searchedAt)}
                      </time>
                      <span>{resultLabel}</span>
                    </span>
                  </span>
                </Button>
              </li>
            )
          })}
        </ol>
      )}
    </Card>
  )
}
