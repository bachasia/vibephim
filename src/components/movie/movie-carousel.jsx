import { useRef } from 'react'
import { Link } from 'react-router-dom'
import MovieCard from './movie-card.jsx'
import { SkeletonCard } from '../ui/skeleton.jsx'

const SCROLL_AMOUNT = 800

export default function MovieCarousel({ title, movies = [], loading, browseLink }) {
  const scrollRef = useRef(null)

  function scroll(dir) {
    scrollRef.current?.scrollBy({ left: dir * SCROLL_AMOUNT, behavior: 'smooth' })
  }

  return (
    <section className="py-6 animate-fade-in">
      {/* Section header — cobephim style */}
      <div className="flex items-center justify-between mb-5 px-6 md:px-12">
        <div className="flex items-center gap-3">
          <span
            className="flex-shrink-0 rounded-sm"
            style={{ width: '4px', height: '28px', background: 'var(--primary)' }}
          />
          <h2
            className="font-semibold leading-tight"
            style={{ fontSize: '1.5rem', color: 'var(--category-name)', textShadow: '0 2px 1px rgba(0,0,0,0.3)' }}
          >
            {title}
          </h2>
        </div>
        {browseLink && (
          <Link
            to={browseLink}
            className="text-xs font-medium transition-colors whitespace-nowrap"
            style={{ color: 'var(--primary)' }}
            onMouseEnter={(e) => { e.currentTarget.style.color = 'var(--primary-hover)' }}
            onMouseLeave={(e) => { e.currentTarget.style.color = 'var(--primary)' }}
          >
            Xem thêm →
          </Link>
        )}
      </div>

      <div className="relative group/carousel">
        {/* Left arrow */}
        <button
          onClick={() => scroll(-1)}
          aria-label="Cuộn trái"
          className="absolute left-2 top-1/2 -translate-y-1/2 z-10 flex items-center justify-center opacity-0 group-hover/carousel:opacity-100 transition-opacity"
          style={{ width: '36px', height: '72px', borderRadius: '6px', background: 'rgba(40,43,58,0.92)', color: '#fff', border: '1px solid var(--border-color)' }}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
            <polyline points="15 18 9 12 15 6" />
          </svg>
        </button>

        <div
          ref={scrollRef}
          className="flex gap-4 overflow-x-auto px-6 md:px-12 pb-2 scroll-smooth"
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
          className="absolute right-2 top-1/2 -translate-y-1/2 z-10 flex items-center justify-center opacity-0 group-hover/carousel:opacity-100 transition-opacity"
          style={{ width: '36px', height: '72px', borderRadius: '6px', background: 'rgba(40,43,58,0.92)', color: '#fff', border: '1px solid var(--border-color)' }}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
            <polyline points="9 18 15 12 9 6" />
          </svg>
        </button>
      </div>
    </section>
  )
}
