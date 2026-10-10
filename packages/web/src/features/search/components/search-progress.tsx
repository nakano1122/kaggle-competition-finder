import { Panel } from '@/components/panel'
import { SectionHeading } from '@/components/section-heading'
import { Badge } from '@/components/shadcn-ui/badge'
import { mockKeywords, pipelineSteps } from '@/lib/search-pipeline'
import type { PipelineStage } from '@/lib/search-pipeline'

type SearchProgressProps = {
  activeStage: PipelineStage | null
  isSearching: boolean
}

export const SearchProgress = ({
  activeStage,
  isSearching,
}: SearchProgressProps) => {
  const activeIndex = pipelineSteps.findIndex((step) => step.id === activeStage)

  return (
    <Panel>
      <SectionHeading number="03" title="検索の進捗">
        <Badge
          className="bg-stone-100 px-3 py-1 text-sm text-stone-700"
          variant="secondary"
        >
          {isSearching ? '処理中' : '待機中'}
        </Badge>
      </SectionHeading>
      <ol className="grid gap-3 sm:grid-cols-5" aria-label="検索の進捗">
        {pipelineSteps.map((step, index) => {
          const isCurrent = isSearching && index === activeIndex
          const isComplete = !isSearching || index < activeIndex
          const marker = isComplete ? '✓' : index + 1
          const markerStyle = isCurrent
            ? 'bg-amber-800 text-white'
            : isComplete
              ? 'bg-emerald-100 text-emerald-800'
              : 'bg-stone-100 text-stone-500'

          return (
            <li className="flex gap-2 text-sm" key={step.id}>
              <span
                aria-hidden="true"
                className={`flex size-6 shrink-0 items-center justify-center rounded-full text-xs font-bold ${markerStyle}`}
              >
                {marker}
              </span>
              <span>
                <strong className="block text-stone-800">{step.label}</strong>
                <small className="text-stone-500">{step.description}</small>
              </span>
            </li>
          )
        })}
      </ol>
      {activeStage ? (
        <p className="mt-5 flex flex-wrap items-center gap-2 text-sm text-stone-600">
          <span className="font-medium">検索キーワード</span>
          {mockKeywords.map((keyword) => (
            <Badge
              className="rounded-md bg-stone-100 px-2 py-1 font-mono text-stone-700"
              key={keyword}
              variant="secondary"
            >
              {keyword}
            </Badge>
          ))}
        </p>
      ) : null}
    </Panel>
  )
}
