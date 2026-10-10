import { Panel } from '@/components/panel'
import { SectionHeading } from '@/components/section-heading'
import { Button } from '@/components/shadcn-ui/button'
import { Textarea } from '@/components/shadcn-ui/textarea'

type QueryEditorProps = {
  isSaving: boolean
  isSearching: boolean
  onChange: (value: string) => void
  onSave: () => void
  onSearch: () => void
  query: string
}

export const QueryEditor = ({
  isSaving,
  isSearching,
  onChange,
  onSave,
  onSearch,
  query,
}: QueryEditorProps) => {
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
      <Textarea
        className="min-h-28 rounded-xl border-slate-300 bg-white p-4 leading-7 text-slate-800 focus-visible:border-indigo-600 focus-visible:ring-indigo-100"
        id="query"
        onChange={(event) => onChange(event.target.value)}
        rows={4}
        value={query}
      />
      <div className="mt-4 flex flex-wrap gap-3">
        <Button
          className="bg-indigo-700 font-semibold hover:bg-indigo-800 disabled:bg-indigo-300"
          disabled={isSearching}
          onClick={onSearch}
          type="button"
        >
          {isSearching ? '検索中…' : 'コンペを検索'}
        </Button>
        <Button
          className="font-semibold text-slate-700 hover:bg-slate-100"
          disabled={isSaving}
          onClick={onSave}
          type="button"
          variant="ghost"
        >
          {isSaving ? '保存中…' : 'このクエリを保存'}
        </Button>
      </div>
    </Panel>
  )
}
