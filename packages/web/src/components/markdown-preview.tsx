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
  if (!content.trim()) {
    return null
  }

  return (
    <section
      aria-label={label}
      className="min-w-0 max-w-full overflow-hidden rounded-xl bg-stone-50 px-4 py-3"
    >
      <p className="mb-2 text-xs font-medium tracking-wide text-stone-500">
        プレビュー
      </p>
      <div className="min-w-0 break-words text-sm leading-7 text-stone-700 [&_blockquote]:border-l-2 [&_blockquote]:border-stone-300 [&_blockquote]:pl-3 [&_code]:rounded [&_code]:bg-stone-200 [&_code]:px-1 [&_code]:py-0.5 [&_h1]:mt-4 [&_h1]:text-xl [&_h1]:font-semibold [&_h2]:mt-4 [&_h2]:text-lg [&_h2]:font-semibold [&_h3]:mt-3 [&_h3]:font-semibold [&_img]:h-auto [&_img]:max-w-full [&_ol]:list-decimal [&_ol]:space-y-1 [&_ol]:pl-5 [&_p]:mb-3 [&_p:last-child]:mb-0 [&_pre]:max-w-full [&_pre]:overflow-x-auto [&_ul]:list-disc [&_ul]:space-y-1 [&_ul]:pl-5">
        <ReactMarkdown components={{ a: MarkdownLink }} skipHtml>
          {content}
        </ReactMarkdown>
      </div>
    </section>
  )
}
