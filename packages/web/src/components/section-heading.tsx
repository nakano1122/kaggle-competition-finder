import type { ReactNode } from 'react'

type SectionHeadingProps = {
  children?: ReactNode
  label?: string
  number?: string
  title: string
}

export const SectionHeading = ({
  children,
  label,
  number,
  title,
}: SectionHeadingProps) => {
  return (
    <div className="flex flex-wrap items-start justify-between gap-4 pb-5">
      <div className="grid min-w-0 gap-1">
        {number ? (
          <p className="text-xs font-semibold tracking-[0.16em] text-stone-500">
            {number}
          </p>
        ) : null}
        <h2 className="text-lg font-semibold text-stone-950">{title}</h2>
      </div>
      {children ?? <span className="text-sm text-stone-500">{label}</span>}
    </div>
  )
}
