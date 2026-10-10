import { initialDashboardData } from '@/lib/mock-data'
import { HomePage } from '@/app/(pages)/home-page'

export const dynamic = 'force-dynamic'

const Page = () => {
  return <HomePage initialData={initialDashboardData} />
}

export default Page
