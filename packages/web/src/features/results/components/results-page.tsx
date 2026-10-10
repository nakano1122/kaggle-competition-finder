'use client'

import Link from 'next/link'
import { useEffect, useRef } from 'react'

import { CompetitionResults } from '@/features/competitions/components/competition-results'
import { FavoriteList } from '@/features/favorites/components/favorite-list'
import { useResultsPage } from '@/features/results/hooks/use-results-page'
import { SearchHistoryList } from '@/features/search/components/search-history-list'
import { SearchProgress } from '@/features/search/components/search-progress'
import {
  clearSearchRequest,
  readSearchRequest,
} from '@/features/search/lib/search-request-storage'
import { Button } from '@/components/shadcn-ui/button'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/shadcn-ui/card'
import type { Favorite } from '@kaggle-competition-finder/schemas'

type ResultsPageProps = {
  initialFavorites: Favorite[]
}

export const ResultsPage = ({ initialFavorites }: ResultsPageProps) => {
  const { loadHistory, search, selectSearchHistory, state, toggleFavorite } =
    useResultsPage(initialFavorites)
  const hasLoaded = useRef(false)

  useEffect(() => {
    if (hasLoaded.current) {
      return
    }

    hasLoaded.current = true
    loadHistory()
    const request = readSearchRequest()

    if (request) {
      clearSearchRequest()
      void search(request)
    }
  }, [loadHistory, search])

  const selectedResult = state.history.find((item) => {
    return item.id === state.selectedHistoryId
  })
  const hasSearchCondition = state.isSearching || selectedResult !== undefined
  const displayedCompetitions = selectedResult?.competitions ?? []

  return (
    <main className="mx-auto w-full max-w-6xl flex-1 px-5 py-10 sm:px-8 sm:py-14">
      <div className="mb-8 flex flex-wrap items-end justify-between gap-5 border-b border-stone-200 pb-6">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight text-stone-950 sm:text-4xl">
            コンペの候補を確認する
          </h1>
        </div>
        <Button asChild className="bg-teal-800 hover:bg-teal-900">
          <Link href="/search">条件を変えて検索する</Link>
        </Button>
      </div>

      {!hasSearchCondition ? (
        <Card className="mx-auto max-w-2xl border-dashed border-stone-300 bg-white py-0 text-center shadow-none">
          <CardHeader className="pt-8">
            <CardTitle className="text-xl text-stone-950">
              検索条件がありません
            </CardTitle>
          </CardHeader>
          <CardContent className="pb-8 text-sm leading-7 text-stone-600">
            研究内容や興味を入力してから、コンペを検索してください。
            <Button
              asChild
              className="mx-auto mt-5 bg-teal-800 hover:bg-teal-900"
            >
              <Link href="/search">検索画面へ進む</Link>
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_18rem]">
          <div className="grid min-w-0 gap-6">
            {state.error ? (
              <div
                className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-800"
                role="alert"
              >
                {state.error}
              </div>
            ) : null}
            <Card className="gap-0 border-stone-200 bg-white py-0 shadow-sm">
              <CardHeader className="py-5">
                <CardTitle className="text-lg text-stone-950">
                  検索に使用したクエリ
                </CardTitle>
              </CardHeader>
              <CardContent className="border-t border-stone-100 py-5 text-sm leading-7 text-stone-700">
                {state.query}
              </CardContent>
            </Card>
            <SearchProgress
              activeStage={state.activeStage}
              isSearching={state.isSearching}
            />
            <CompetitionResults
              competitions={displayedCompetitions}
              favorites={state.favorites}
              isSearching={state.isSearching}
              onToggleFavorite={toggleFavorite}
              query={state.query}
            />
          </div>
          <aside className="grid content-start gap-6 lg:sticky lg:top-6">
            <SearchHistoryList
              onSelect={selectSearchHistory}
              searches={state.history}
              selectedId={state.selectedHistoryId}
            />
            <FavoriteList favorites={state.favorites} />
          </aside>
        </div>
      )}
    </main>
  )
}
