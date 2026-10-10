import { ResultsPage as ResultsView } from '@/features/results/components/results-page'
import { initialResultsData } from '@/lib/mock-data'

const ResultsPage = () => {
  return <ResultsView initialFavorites={initialResultsData.favorites} />
}

export default ResultsPage
