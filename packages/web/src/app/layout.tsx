import './styles.css'
import type { Metadata } from 'next'
import type { ReactNode } from 'react'

import { SiteHeader } from '@/components/site-header'

export const metadata: Metadata = {
  description:
    '研究・開発実績に適したKaggleコンペティションを検索・推薦するアプリケーション',
  title: 'Kaggle Competition Finder',
}

const RootLayout = ({ children }: { children: ReactNode }) => {
  return (
    <html lang="ja">
      <body className="min-h-screen bg-stone-50 text-stone-900 antialiased">
        <div className="flex min-h-screen flex-col">
          <SiteHeader />
          {children}
        </div>
      </body>
    </html>
  )
}

export default RootLayout
