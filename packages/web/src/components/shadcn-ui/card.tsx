import * as React from 'react'
import { cn } from 'cn'

const Card = ({ className, ...props }: React.ComponentProps<'div'>) => {
  return (
    <div
      data-slot="card"
      className={cn(
        'flex w-full min-w-0 max-w-full flex-col gap-6 rounded-xl border bg-card py-6 text-card-foreground shadow-sm',
        className,
      )}
      {...props}
    />
  )
}

const CardHeader = ({ className, ...props }: React.ComponentProps<'div'>) => {
  return (
    <div
      data-slot="card-header"
      className={cn(
        '@container/card-header grid min-w-0 max-w-full auto-rows-min grid-rows-[auto_auto] items-start gap-2 px-6 has-data-[slot=card-action]:grid-cols-[minmax(0,1fr)_auto] [.border-b]:pb-6',
        className,
      )}
      {...props}
    />
  )
}

const CardTitle = ({ className, ...props }: React.ComponentProps<'div'>) => {
  return (
    <div
      data-slot="card-title"
      className={cn(
        'min-w-0 break-words leading-none font-semibold',
        className,
      )}
      {...props}
    />
  )
}

const CardDescription = ({
  className,
  ...props
}: React.ComponentProps<'div'>) => {
  return (
    <div
      data-slot="card-description"
      className={cn(
        'min-w-0 break-words text-sm text-muted-foreground',
        className,
      )}
      {...props}
    />
  )
}

const CardAction = ({ className, ...props }: React.ComponentProps<'div'>) => {
  return (
    <div
      data-slot="card-action"
      className={cn(
        'col-start-2 row-span-2 row-start-1 self-start justify-self-end',
        className,
      )}
      {...props}
    />
  )
}

const CardContent = ({ className, ...props }: React.ComponentProps<'div'>) => {
  return (
    <div
      data-slot="card-content"
      className={cn('min-w-0 max-w-full px-6', className)}
      {...props}
    />
  )
}

const CardFooter = ({ className, ...props }: React.ComponentProps<'div'>) => {
  return (
    <div
      data-slot="card-footer"
      className={cn(
        'flex min-w-0 max-w-full flex-wrap items-center px-6 [.border-t]:pt-6',
        className,
      )}
      {...props}
    />
  )
}

export {
  Card,
  CardHeader,
  CardFooter,
  CardTitle,
  CardAction,
  CardDescription,
  CardContent,
}
