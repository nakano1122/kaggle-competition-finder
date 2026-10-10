'use client'

import { Button } from '@/components/shadcn-ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/shadcn-ui/card'
import { Textarea } from '@/components/shadcn-ui/textarea'
import { MarkdownPreview } from '@/components/markdown-preview'
import { useSearchStart } from '@/features/search/hooks/use-search-start'
import type { ChangeEvent, FormEvent } from 'react'

const profilePlaceholder =
  '例: 医療画像の分類を研究しています。Python と深層学習を活用でき、社会課題に関わるテーマに興味があります。'

const queryPlaceholder =
  '研究内容・興味を入力すると、ここに検索用の日本語クエリを生成します。'

export const SearchStartPage = () => {
  const { saveProfile, setProfile, setQuery, startSearch, state } =
    useSearchStart()

  const handleProfileChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
    setProfile(event.target.value)
  }

  const handleQueryChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
    setQuery(event.target.value)
  }

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    startSearch()
  }

  return (
    <main className="flex-1 bg-stone-50 text-stone-950">
      <div className="mx-auto w-full max-w-2xl px-5 py-10 sm:px-8 sm:py-14">
        <div className="mb-8">
          <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
            研究内容・興味から、Kaggleコンペを探す
          </h1>
          <p className="mt-3 text-sm leading-7 text-stone-600 sm:text-base">
            取り組みと興味を手がかりに、Kaggleコンペを検索します。
          </p>
        </div>

        <form className="grid gap-5" onSubmit={handleSubmit}>
          <Card className="gap-0 rounded-2xl border-stone-200 bg-white py-0 shadow-sm">
            <CardHeader className="gap-1 border-b border-stone-100 px-5 py-5 sm:px-6">
              <CardTitle className="text-base text-stone-900">
                研究内容・興味
              </CardTitle>
              <CardDescription className="leading-6 text-stone-600">
                これまでの経験や、これから取り組みたいテーマを書いてください。
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 px-5 pt-5 sm:px-6">
              <label className="sr-only" htmlFor="profile">
                研究内容・興味
              </label>
              <Textarea
                className="min-h-40 resize-y rounded-xl border-stone-300 bg-white p-4 leading-7 text-stone-800 focus-visible:border-teal-700 focus-visible:ring-teal-100"
                disabled={!state.isLoaded}
                id="profile"
                onChange={handleProfileChange}
                placeholder={profilePlaceholder}
                rows={6}
                value={state.profile}
              />
              <MarkdownPreview
                content={state.profile}
                label="研究内容・興味のプレビュー"
              />
            </CardContent>
            <CardFooter className="flex-col items-stretch justify-between gap-3 border-t border-stone-100 px-5 py-4 sm:flex-row sm:items-center sm:px-6">
              <p
                aria-live="polite"
                className="min-w-0 break-words text-sm text-stone-500"
              >
                {state.isProfileSaved
                  ? 'このブラウザに保存済みです。'
                  : '保存は任意です。検索だけなら保存せずに進めます。'}
              </p>
              <Button
                className="w-full border-stone-300 text-stone-700 hover:bg-stone-100 sm:w-auto"
                disabled={!state.isLoaded}
                onClick={saveProfile}
                type="button"
                variant="outline"
              >
                この内容を保存
              </Button>
            </CardFooter>
          </Card>

          <Card className="gap-0 rounded-2xl border-stone-200 bg-white py-0 shadow-sm">
            <CardHeader className="gap-1 border-b border-stone-100 px-5 py-5 sm:px-6">
              <CardTitle className="text-base text-stone-900">
                LLMで生成したクエリ
              </CardTitle>
              <CardDescription className="leading-6 text-stone-600">
                研究内容・興味から作成した日本語クエリです。必要なら編集できます。
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 px-5 pt-5 sm:px-6">
              <label className="sr-only" htmlFor="query">
                LLMで生成したクエリ
              </label>
              <Textarea
                className="min-h-32 resize-y rounded-xl border-stone-300 bg-stone-50 p-4 leading-7 text-stone-800 focus-visible:border-amber-700 focus-visible:ring-amber-100"
                disabled={!state.isLoaded}
                id="query"
                onChange={handleQueryChange}
                placeholder={queryPlaceholder}
                rows={5}
                value={state.query}
              />
              <MarkdownPreview
                content={state.query}
                label="LLMで生成したクエリのプレビュー"
              />
            </CardContent>
          </Card>

          {state.error ? (
            <p
              aria-live="polite"
              className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-800"
              role="alert"
            >
              {state.error}
            </p>
          ) : null}

          <Button
            className="h-12 rounded-xl bg-teal-800 text-base font-semibold hover:bg-teal-900"
            disabled={!state.isLoaded}
            size="lg"
            type="submit"
          >
            この条件でコンペを検索
          </Button>
        </form>
      </div>
    </main>
  )
}
