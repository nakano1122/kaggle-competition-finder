import Link from 'next/link'

import { Button } from '@/components/shadcn-ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/shadcn-ui/card'

const steps = [
  {
    description: '取り組んできたことや得意な技術を、短い文章で入力します。',
    number: '01',
    title: '経験を入力する',
  },
  {
    description: '経験をもとに、探したいKaggleコンペの条件を整えます。',
    number: '02',
    title: '条件を決める',
  },
  {
    description: '候補と締切を比べ、検索結果をあとから見返せます。',
    number: '03',
    title: 'コンペを比べる',
  },
]

const values = [
  {
    description: '経験を言葉にして、検索の手がかりにします。',
    title: '経験を活かす',
  },
  {
    description: 'クエリを編集しながら、探す条件を何度でも調整できます。',
    title: '条件を調整する',
  },
  {
    description: '過去の検索結果と保存した候補を、いつでも見返せます。',
    title: '候補を見返す',
  },
]

export const HomePage = () => {
  return (
    <main className="flex-1">
      <section className="border-b border-stone-200 bg-amber-50">
        <div className="mx-auto grid max-w-6xl gap-10 px-5 py-16 sm:px-8 sm:py-24 lg:grid-cols-[1.15fr_0.85fr] lg:items-center lg:gap-16">
          <div className="min-w-0">
            <h1 className="max-w-3xl text-4xl font-semibold tracking-tight text-stone-900 sm:text-5xl lg:text-6xl">
              研究内容や興味から、
              <br className="hidden sm:block" />
              Kaggleコンペを探す。
            </h1>
            <p className="mt-6 max-w-2xl text-base leading-8 text-stone-700 sm:text-lg">
              {'Kaggle Competition Finder'}
              は、これまでの経験を手がかりに、自分に合うKaggleコンペを検索するためのアプリです。
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button
                asChild
                className="bg-teal-800 hover:bg-teal-900"
                size="lg"
              >
                <Link href="/search">コンペを探す</Link>
              </Button>
            </div>
          </div>
          <Card className="gap-0 border-stone-300 bg-stone-50 py-0 shadow-lg shadow-stone-900/5">
            <CardHeader className="border-b border-stone-200 bg-white/70 py-5">
              <CardDescription className="font-medium tracking-wide text-teal-800">
                検索の流れ
              </CardDescription>
              <CardTitle className="text-xl text-stone-900">
                経験から、候補へ。
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-5 py-6">
              {steps.map((step) => (
                <div
                  className="grid min-w-0 grid-cols-[auto_minmax(0,1fr)] gap-3"
                  key={step.number}
                >
                  <span className="pt-0.5 text-sm font-semibold text-amber-700">
                    {step.number}
                  </span>
                  <div className="min-w-0">
                    <h2 className="font-semibold text-stone-900">
                      {step.title}
                    </h2>
                    <p className="mt-1 text-sm leading-6 text-stone-600">
                      {step.description}
                    </p>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-5 py-16 sm:px-8 sm:py-24">
        <div className="max-w-2xl">
          <h2 className="text-3xl font-semibold tracking-tight text-stone-900 sm:text-4xl">
            経験を手がかりに、コンペを見つける。
          </h2>
        </div>
        <div className="mt-10 grid gap-4 md:grid-cols-3">
          {values.map((value) => (
            <Card
              className="gap-0 border-stone-200 bg-white py-0 shadow-none"
              key={value.title}
            >
              <CardHeader className="py-6">
                <CardTitle className="text-lg text-stone-900">
                  {value.title}
                </CardTitle>
                <CardDescription className="pt-2 leading-6 text-stone-600">
                  {value.description}
                </CardDescription>
              </CardHeader>
            </Card>
          ))}
        </div>
      </section>

      <section className="border-y border-stone-200 bg-teal-950">
        <div className="mx-auto flex max-w-6xl flex-col items-start justify-between gap-6 px-5 py-12 sm:px-8 sm:py-16 md:flex-row md:items-end">
          <div className="min-w-0">
            <h2 className="text-3xl font-semibold tracking-tight text-stone-50 sm:text-4xl">
              まずは、研究内容や興味から。
            </h2>
          </div>
          <Button
            asChild
            className="bg-amber-400 text-stone-950 hover:bg-amber-300"
            size="lg"
          >
            <Link href="/search">コンペを探す</Link>
          </Button>
        </div>
      </section>
    </main>
  )
}
