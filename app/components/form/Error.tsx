import { LuAlertCircle } from 'react-icons/lu'

import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "~/components/ui/alert"
import { cn } from '~/lib/utils'

export function Error(props: JSX.IntrinsicElements['div']) {
  return <div className="mt-2 text-xs font-semibold text-red-600" {...props} />
}

export function Errors(props: JSX.IntrinsicElements['div']) {
  return (

    <Alert variant="destructive" className={cn("w-full max-w-[610px] m-auto mb-4 py-4 bg-white rounded-md shadow-md p-4 relative", props.className)}>
      <LuAlertCircle className="w-4 h-4" />
      <AlertTitle>Erro:</AlertTitle>
      <AlertDescription>
        <div {...props} />
      </AlertDescription>
    </Alert>
  )
}
