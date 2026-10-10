import type { ReactNode } from 'react'
import { Card } from '@/components/shadcn-ui/card'

export const Panel = ({ children }: { children: ReactNode }) => {
  return (
    <Card className="gap-0 rounded-2xl border-stone-200 bg-white p-6 shadow-sm">
      {children}
    </Card>
  )
}
