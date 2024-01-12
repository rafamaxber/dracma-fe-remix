export function Error(props: JSX.IntrinsicElements['div']) {
  return <div className="mt-2 text-xs font-semibold text-red-600" {...props} />
}

export function Errors(props: JSX.IntrinsicElements['div']) {
  return <div className="flex flex-col space-y-2 font-semibold text-center text-red-600" {...props} />
}
