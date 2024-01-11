export function Error(props: JSX.IntrinsicElements['div']) {
  return <div className="text-sm text-red-600" {...props} />
}

export function Errors(props: JSX.IntrinsicElements['div']) {
  return <div className="flex flex-col space-y-2 text-center" {...props} />
}
