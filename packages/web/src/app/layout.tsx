import './styles.css'
import type { Metadata } from 'next'
import type { ReactNode } from 'react'

export const metadata: Metadata = {
  description:
    '研究・開発実績に適したKaggleコンペティションを検索・推薦するアプリケーション',
  title: 'Kaggle Competition Finder',
}

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="ja">
      <body className="min-h-screen bg-slate-50 text-slate-950">
        {children}
      </body>
    </html>
  )
}
