import { Panel } from '@/components/panel'
import { SectionHeading } from '@/components/section-heading'
import { Button } from '@/components/shadcn-ui/button'
import { Textarea } from '@/components/shadcn-ui/textarea'

type ProfileEditorProps = {
  isSaving: boolean
  onChange: (value: string) => void
  onSave: () => void
  profile: string
}

export const ProfileEditor = ({
  isSaving,
  onChange,
  onSave,
  profile,
}: ProfileEditorProps) => {
  return (
    <Panel>
      <SectionHeading label="検索の出発点" number="01" title="研究・開発実績" />
      <label className="sr-only" htmlFor="profile">
        研究・開発実績
      </label>
      <Textarea
        className="min-h-36 rounded-xl border-slate-300 bg-white p-4 leading-7 text-slate-800 focus-visible:border-indigo-600 focus-visible:ring-indigo-100"
        id="profile"
        onChange={(event) => onChange(event.target.value)}
        rows={6}
        value={profile}
      />
      <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm text-slate-500">
          専門領域、使った技術、取り組みたい課題を自由に書けます。
        </p>
        <Button
          className="border-slate-300 font-semibold text-slate-700 hover:bg-slate-50"
          disabled={isSaving}
          onClick={onSave}
          type="button"
          variant="outline"
        >
          {isSaving ? '保存中…' : '実績を保存'}
        </Button>
      </div>
    </Panel>
  )
}
