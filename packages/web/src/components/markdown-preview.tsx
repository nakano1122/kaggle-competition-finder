import Link from 'next/link'
import type { ComponentPropsWithoutRef } from 'react'
import ReactMarkdown from 'react-markdown'

type MarkdownPreviewProps = {
  content: string
  label: string
}

type MarkdownLinkProps = ComponentPropsWithoutRef<'a'>

const MarkdownLink = ({ children, href }: MarkdownLinkProps) => {
  if (!href) {
    return children
  }

  return (
    <Link
      className="break-words text-teal-800 underline underline-offset-4 hover:text-teal-950"
      href={href}
    >
      {children}
    </Link>
  )
}

export const MarkdownPreview = ({ content, label }: MarkdownPreviewProps) => {
  const hasContent = content.trim().length > 0

  return (
    <section
      aria-label={label}
      className="grid w-full min-w-0 max-w-full gap-2 overflow-hidden rounded-xl bg-stone-50 px-4 py-3"
    >
      <p className="text-xs font-medium tracking-wide text-stone-500">
        プレビュー
      </p>
      {hasContent ? (
        <div className="grid min-w-0 max-w-full gap-3 break-words text-sm leading-7 text-stone-700 [&_blockquote]:min-w-0 [&_blockquote]:border-l-2 [&_blockquote]:border-stone-300 [&_blockquote]:pl-3 [&_code]:rounded [&_code]:bg-stone-200 [&_code]:px-1 [&_code]:py-0.5 [&_h1]:min-w-0 [&_h1]:text-xl [&_h1]:font-semibold [&_h2]:min-w-0 [&_h2]:text-lg [&_h2]:font-semibold [&_h3]:min-w-0 [&_h3]:font-semibold [&_img]:h-auto [&_img]:max-w-full [&_ol]:grid [&_ol]:min-w-0 [&_ol]:list-decimal [&_ol]:gap-1 [&_ol]:pl-5 [&_p]:min-w-0 [&_pre]:max-w-full [&_pre]:overflow-x-auto [&_ul]:grid [&_ul]:min-w-0 [&_ul]:list-disc [&_ul]:gap-1 [&_ul]:pl-5">
          <ReactMarkdown components={{ a: MarkdownLink }} skipHtml>
            {content}
          </ReactMarkdown>
        </div>
      ) : (
        <p className="text-sm leading-7 text-stone-500">
          Markdownで入力した内容がここに表示されます。
        </p>
      )}
    </section>
  )
}
