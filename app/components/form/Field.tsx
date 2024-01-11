import { cn } from '~/lib/utils'

export function Field({
  className,
  ...props
}): JSX.IntrinsicElements['fieldset'] {
  return (
    <fieldset className={cn("flex-grow w-full", className)} {...props} />
  )
}
