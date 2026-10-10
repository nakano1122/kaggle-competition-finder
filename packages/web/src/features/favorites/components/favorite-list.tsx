import { SectionHeading } from '@/components/section-heading'
import { Badge } from '@/components/shadcn-ui/badge'
import { Card } from '@/components/shadcn-ui/card'
import { formatDate } from '@/lib/format-date'
import type { Favorite } from '@kaggle-competition-finder/schemas'
import Link from 'next/link'

export const FavoriteList = ({ favorites }: { favorites: Favorite[] }) => {
  return (
    <Card className="gap-0 rounded-2xl border-stone-200 bg-white p-5 shadow-sm">
      <SectionHeading title="お気に入り">
        <Badge
          className="bg-stone-100 px-3 py-1 text-sm text-stone-700"
          variant="secondary"
        >
          {favorites.length}
        </Badge>
      </SectionHeading>
      {favorites.length === 0 ? (
        <p className="text-sm leading-6 text-stone-600">
          気になるコンペを保存して、あとから見比べられます。
        </p>
      ) : (
        <ul className="grid gap-4">
          {favorites.map((favorite) => (
            <li
              className="border-b border-stone-100 pb-4 last:border-0 last:pb-0"
              key={favorite.competitionId}
            >
              <Link
                className="text-sm font-semibold leading-6 text-stone-800 hover:text-amber-800"
                href={favorite.url}
                rel="noreferrer"
                target="_blank"
              >
                {favorite.title}
              </Link>
              <time
                className="mt-1 block text-xs text-stone-500"
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
