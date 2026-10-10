import { Panel } from '@/components/panel'
import { SectionHeading } from '@/components/section-heading'

type ProfileEditorProps = {
  isSaving: boolean
  onChange: (value: string) => void
  onSave: () => void
  profile: string
}

export function ProfileEditor({
  isSaving,
  onChange,
  onSave,
  profile,
}: ProfileEditorProps) {
  return (
    <Panel>
      <SectionHeading label="検索の出発点" number="01" title="研究・開発実績" />
      <label className="sr-only" htmlFor="profile">
        研究・開発実績
      </label>
      <textarea
        className="min-h-36 w-full rounded-xl border border-slate-300 bg-white p-4 text-sm leading-7 text-slate-800 outline-none transition focus:border-indigo-600 focus:ring-2 focus:ring-indigo-100"
        id="profile"
        onChange={(event) => onChange(event.target.value)}
        rows={6}
        value={profile}
      />
      <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm text-slate-500">
          専門領域、使った技術、取り組みたい課題を自由に書けます。
        </p>
        <button
          className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60"
          disabled={isSaving}
          onClick={onSave}
          type="button"
        >
          {isSaving ? '保存中…' : '実績を保存'}
        </button>
      </div>
    </Panel>
  )
}
