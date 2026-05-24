// Animated placeholder for loading states
export function SkeletonCard() {
  return (
    <div className="flex-shrink-0 w-40 md:w-48 animate-pulse">
      <div className="aspect-[2/3] rounded-sm bg-white/10" />
      <div className="mt-2 h-3 bg-white/10 rounded w-3/4" />
      <div className="mt-1 h-3 bg-white/10 rounded w-1/2" />
    </div>
  )
}

export function SkeletonGridCard() {
  return (
    <div className="animate-pulse">
      <div className="aspect-[2/3] rounded-sm bg-white/10" />
      <div className="mt-2 h-3 bg-white/10 rounded w-3/4" />
      <div className="mt-1 h-3 bg-white/10 rounded w-1/2" />
    </div>
  )
}

export function SkeletonBanner() {
  return (
    <div className="w-full aspect-[16/7] bg-white/10 animate-pulse" />
  )
}
