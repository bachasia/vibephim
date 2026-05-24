export function SkeletonCard() {
  return (
    <div className="flex-shrink-0 animate-pulse" style={{ width: '185px' }}>
      <div className="rounded-lg" style={{ width: '100%', paddingBottom: '150%', height: 0, background: 'var(--bg-3)' }} />
      <div className="mt-2 h-3 rounded" style={{ background: 'var(--bg-3)', width: '80%' }} />
      <div className="mt-1 h-3 rounded" style={{ background: 'var(--bg-3)', width: '55%' }} />
    </div>
  )
}

export function SkeletonGridCard() {
  return (
    <div className="animate-pulse">
      <div className="rounded-lg" style={{ width: '100%', paddingBottom: '150%', height: 0, background: 'var(--bg-3)' }} />
      <div className="mt-2 h-3 rounded" style={{ background: 'var(--bg-3)', width: '75%' }} />
      <div className="mt-1 h-3 rounded" style={{ background: 'var(--bg-3)', width: '50%' }} />
    </div>
  )
}

export function SkeletonBanner() {
  return (
    <div
      className="w-full animate-pulse"
      style={{ height: '860px', background: 'var(--top-bg)', marginBottom: '-120px' }}
    />
  )
}
