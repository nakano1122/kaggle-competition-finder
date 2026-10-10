import { Panel } from '@/components/panel'
import { SectionHeading } from '@/components/section-heading'

type QueryEditorProps = {
  isSaving: boolean
  isSearching: boolean
  onChange: (value: string) => void
  onSave: () => void
  onSearch: () => void
  query: string
}

export function QueryEditor({
  isSaving,
  isSearching,
  onChange,
  onSave,
  onSearch,
  query,
}: QueryEditorProps) {
  return (
    <Panel>
      <SectionHeading
        label="自由に編集できます"
        number="02"
        title="検索クエリ"
      />
      <label className="sr-only" htmlFor="query">
        検索クエリ
      </label>
      <textarea
        className="min-h-28 w-full rounded-xl border border-slate-300 bg-white p-4 text-sm leading-7 text-slate-800 outline-none transition focus:border-indigo-600 focus:ring-2 focus:ring-indigo-100"
        id="query"
        onChange={(event) => onChange(event.target.value)}
        rows={4}
        value={query}
      />
      <div className="mt-4 flex flex-wrap gap-3">
        <button
          className="rounded-lg bg-indigo-700 px-4 py-2 text-sm font-semibold text-white transition hover:bg-indigo-800 disabled:cursor-not-allowed disabled:bg-indigo-300"
          disabled={isSearching}
          onClick={onSearch}
          type="button"
        >
          {isSearching ? '検索中…' : 'コンペを検索'}
        </button>
        <button
          className="rounded-lg px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-60"
          disabled={isSaving}
          onClick={onSave}
          type="button"
        >
          {isSaving ? '保存中…' : 'このクエリを保存'}
        </button>
      </div>
    </Panel>
  )
}
