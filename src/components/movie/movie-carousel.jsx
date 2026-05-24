import { useRef } from 'react'
import { Link } from 'react-router-dom'
import MovieCard from './movie-card.jsx'
import { SkeletonCard } from '../ui/skeleton.jsx'

const SCROLL_AMOUNT = 600

export default function MovieCarousel({ title, movies = [], loading, browseLink }) {
  const scrollRef = useRef(null)

  function scroll(dir) {
    scrollRef.current?.scrollBy({ left: dir * SCROLL_AMOUNT, behavior: 'smooth' })
  }

  return (
    <section className="py-6">
      {/* Header row */}
      <div className="flex items-center justify-between mb-4 px-6 md:px-12">
        <h2 className="text-base md:text-lg font-bold text-white">{title}</h2>
        {browseLink && (
          <Link
            to={browseLink}
            className="text-xs font-medium transition-colors"
            style={{ color: '#e50914' }}
          >
            Xem thêm →
          </Link>
        )}
      </div>

      {/* Scroll container with arrow buttons */}
      <div className="relative group/carousel">
        {/* Left arrow */}
        <button
          onClick={() => scroll(-1)}
          aria-label="Cuộn trái"
          className="absolute left-1 top-1/2 -translate-y-1/2 z-10 w-8 h-16 rounded-sm bg-black/70 text-white flex items-center justify-center opacity-0 group-hover/carousel:opacity-100 transition-opacity hover:bg-black"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
            <polyline points="15 18 9 12 15 6" />
          </svg>
        </button>

        {/* Scrollable list */}
        <div
          ref={scrollRef}
          className="flex gap-3 overflow-x-auto px-6 md:px-12 pb-2 scroll-smooth"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {loading
            ? Array.from({ length: 8 }).map((_, i) => <SkeletonCard key={i} />)
            : movies.map((m) => <MovieCard key={m._id || m.slug} movie={m} />)
          }
        </div>

        {/* Right arrow */}
        <button
          onClick={() => scroll(1)}
          aria-label="Cuộn phải"
          className="absolute right-1 top-1/2 -translate-y-1/2 z-10 w-8 h-16 rounded-sm bg-black/70 text-white flex items-center justify-center opacity-0 group-hover/carousel:opacity-100 transition-opacity hover:bg-black"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
            <polyline points="9 18 15 12 9 6" />
          </svg>
        </button>
      </div>
    </section>
  )
}
