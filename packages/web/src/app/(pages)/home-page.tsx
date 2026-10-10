import { Dashboard } from '@/features/dashboard/components/dashboard'
import type { InitialDashboardData } from '@/lib/mock-data'

export function HomePage({
  initialData,
}: {
  initialData: InitialDashboardData
}) {
  return (
    <main>
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto max-w-7xl px-5 py-14 lg:px-8 lg:py-20">
          <p className="text-sm font-semibold tracking-[0.18em] text-indigo-700">
            Kaggle Competition Finder
          </p>
          <h1 className="mt-4 max-w-3xl text-4xl font-bold tracking-tight text-slate-950 sm:text-5xl">
            経験を活かせる、次のコンペを見つける。
          </h1>
          <p className="mt-5 max-w-2xl text-base leading-8 text-slate-600">
            実績から検索意図を整え、候補の情報と日本語要約をまとめて確認できます。
          </p>
        </div>
      </header>
      <Dashboard initialData={initialData} />
    </main>
  )
}
