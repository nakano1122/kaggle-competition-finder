import { Panel } from '@/components/panel'
import { SectionHeading } from '@/components/section-heading'
import { mockKeywords, pipelineSteps } from '@/lib/search-pipeline'
import type { PipelineStage } from '@/lib/search-pipeline'

type SearchProgressProps = {
  activeStage: PipelineStage | null
  isSearching: boolean
}

export function SearchProgress({
  activeStage,
  isSearching,
}: SearchProgressProps) {
  const activeIndex = pipelineSteps.findIndex((step) => step.id === activeStage)

  return (
    <Panel>
      <SectionHeading number="03" title="検索の進捗">
        <span className="rounded-full bg-slate-100 px-3 py-1 text-sm font-medium text-slate-600">
          {isSearching ? '処理中' : '待機中'}
        </span>
      </SectionHeading>
      <ol className="grid gap-3 sm:grid-cols-5" aria-label="検索の進捗">
        {pipelineSteps.map((step, index) => {
          const isCurrent = isSearching && index === activeIndex
          const isComplete = !isSearching || index < activeIndex
          const marker = isComplete ? '✓' : index + 1
          const markerStyle = isCurrent
            ? 'bg-indigo-700 text-white'
            : isComplete
              ? 'bg-emerald-100 text-emerald-800'
              : 'bg-slate-100 text-slate-500'

          return (
            <li className="flex gap-2 text-sm" key={step.id}>
              <span
                aria-hidden="true"
                className={`flex size-6 shrink-0 items-center justify-center rounded-full text-xs font-bold ${markerStyle}`}
              >
                {marker}
              </span>
              <span>
                <strong className="block text-slate-800">{step.label}</strong>
                <small className="text-slate-500">{step.description}</small>
              </span>
            </li>
          )
        })}
      </ol>
      {activeStage ? (
        <p className="mt-5 flex flex-wrap items-center gap-2 text-sm text-slate-600">
          <span className="font-medium">検索キーワード</span>
          {mockKeywords.map((keyword) => (
            <code
              className="rounded-md bg-slate-100 px-2 py-1 text-xs text-slate-700"
              key={keyword}
            >
              {keyword}
            </code>
          ))}
        </p>
      ) : null}
    </Panel>
  )
}
