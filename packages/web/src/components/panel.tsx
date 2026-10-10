import type { ReactNode } from 'react'

export function Panel({ children }: { children: ReactNode }) {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      {children}
    </section>
  )
}
