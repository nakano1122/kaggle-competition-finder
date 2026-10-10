'use client'

import { CompetitionResults } from '@/features/competitions/components/competition-results'
import { FavoriteList } from '@/features/favorites/components/favorite-list'
import { ProfileEditor } from '@/features/profile/components/profile-editor'
import { SavedQueryList } from '@/features/saved-queries/components/saved-query-list'
import { QueryEditor } from '@/features/search/components/query-editor'
import { SearchProgress } from '@/features/search/components/search-progress'
import { useDashboard } from '@/features/dashboard/hooks/use-dashboard'
import type { InitialDashboardData } from '@/lib/mock-data'

export function Dashboard({
  initialData,
}: {
  initialData: InitialDashboardData
}) {
  const {
    removeSavedQuery,
    saveProfile,
    saveQuery,
    search,
    setProfile,
    setQuery,
    state,
    toggleFavorite,
  } = useDashboard(initialData)

  return (
    <div className="mx-auto grid max-w-7xl gap-6 px-5 py-10 lg:grid-cols-[minmax(0,1fr)_20rem] lg:px-8">
      <div className="grid gap-6">
        {state.error ? (
          <div
            className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-800"
            role="alert"
          >
            {state.error}
          </div>
        ) : null}
        <ProfileEditor
          isSaving={state.isSavingProfile}
          onChange={setProfile}
          onSave={saveProfile}
          profile={state.profile}
        />
        <QueryEditor
          isSaving={state.isSavingQuery}
          isSearching={state.isSearching}
          onChange={setQuery}
          onSave={saveQuery}
          onSearch={search}
          query={state.query}
        />
        <SearchProgress
          activeStage={state.activeStage}
          isSearching={state.isSearching}
        />
        <CompetitionResults
          competitions={state.competitions}
          favorites={state.favorites}
          isSearching={state.isSearching}
          onToggleFavorite={toggleFavorite}
          query={state.query}
        />
      </div>
      <aside className="grid content-start gap-6">
        <SavedQueryList
          onDelete={removeSavedQuery}
          onSelect={setQuery}
          savedQueries={state.savedQueries}
        />
        <FavoriteList favorites={state.favorites} />
      </aside>
    </div>
  )
}
