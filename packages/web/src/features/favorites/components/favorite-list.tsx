import { SectionHeading } from '@/components/section-heading'
import { Badge } from '@/components/shadcn-ui/badge'
import { Card } from '@/components/shadcn-ui/card'
import { formatDate } from '@/lib/format-date'
import type { Favorite } from '@kaggle-competition-finder/schemas'
import Link from 'next/link'

export const FavoriteList = ({ favorites }: { favorites: Favorite[] }) => {
  return (
    <Card className="gap-0 rounded-2xl border-slate-200 bg-white p-5 shadow-sm">
      <SectionHeading number="FAVORITES" title="お気に入り">
        <Badge
          className="bg-slate-100 px-3 py-1 text-sm text-slate-600"
          variant="secondary"
        >
          {favorites.length}
        </Badge>
      </SectionHeading>
      {favorites.length === 0 ? (
        <p className="text-sm leading-6 text-slate-500">
          気になるコンペを保存して、あとから見比べられます。
        </p>
      ) : (
        <ul className="grid gap-4">
          {favorites.map((favorite) => (
            <li
              className="border-b border-slate-100 pb-4 last:border-0 last:pb-0"
              key={favorite.competitionId}
            >
              <Link
                className="text-sm font-semibold leading-6 text-slate-800 hover:text-indigo-700"
                href={favorite.url}
                rel="noreferrer"
                target="_blank"
              >
                {favorite.title}
              </Link>
              <time
                className="mt-1 block text-xs text-slate-500"
                dateTime={favorite.createdAt}
              >
                {formatDate(favorite.createdAt)}
              </time>
            </li>
          ))}
        </ul>
      )}
    </Card>
  )
}
