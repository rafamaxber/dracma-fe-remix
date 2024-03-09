import { cn } from '~/lib/utils'

type Props = {
  className?: string
} & JSX.IntrinsicElements['fieldset']

export function Field({
  className,
  ...props
}: Props) {
  return (
    <fieldset className={cn("flex-grow w-full", className)} {...props} />
  )
}
