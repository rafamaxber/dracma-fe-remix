export function Layout({ type, children }: { type: string; children: React.ReactNode; }) {
  if (type === 'flex-2') {
    return (
      <div className='flex-wrap gap-4 space-y-4 md:space-y-0 md:flex'>
        {children}
      </div>
    );
  }

  return children;
}
