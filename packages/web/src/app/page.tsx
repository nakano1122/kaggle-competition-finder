import { initialDashboardData } from '@/lib/mock-data'
import { HomePage } from '@/app/(pages)/home-page'

export const dynamic = 'force-dynamic'

export default function Page() {
  return <HomePage initialData={initialDashboardData} />
}
