import { useState, useEffect, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { getImageUrl, getMovieDetail } from '../../services/ophim-api.js'
import { SkeletonBanner } from '../ui/skeleton.jsx'

export default function HeroBanner({ movies = [], loading }) {
  const navigate = useNavigate()
  const featured = useMemo(() => {
    if (!movies.length) return null
    return movies[Math.floor(Math.random() * Math.min(movies.length, 10))]
  }, [movies])

  const [current, setCurrent] = useState(featured)
  // Full detail data for the current featured movie
  const [detail, setDetail] = useState(null)

  // Auto-rotate every 8s among first 5 movies
  useEffect(() => {
    if (movies.length < 2) return
    const pool = movies.slice(0, 5)
    const id = setInterval(() => {
      setCurrent(pool[Math.floor(Math.random() * pool.length)])
      setDetail(null) // clear detail so it refetches
    }, 8000)
    return () => clearInterval(id)
  }, [movies])

  useEffect(() => {
    if (featured) { setCurrent(featured); setDetail(null) }
  }, [featured])

  // Fetch full detail whenever current changes to get quality/lang/country/desc
  useEffect(() => {
    if (!current?.slug) return
    let cancelled = false
    getMovieDetail(current.slug)
      .then((data) => {
        if (!cancelled) setDetail(data.movie || null)
      })
      .catch(() => {})
    return () => { cancelled = true }
  }, [current?.slug])

  if (loading) return <SkeletonBanner />
  if (!current) return null

  // Merge list item + full detail (detail takes priority for richer fields)
  const movie = detail ? { ...current, ...detail } : current

  const bgImg = getImageUrl(movie.poster_url || movie.thumb_url)
  const desc = movie.content
    ? movie.content.replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim().slice(0, 240)
    : null
  const country = Array.isArray(movie.country)
    ? movie.country.map((c) => c.name).join(', ')
    : ''
  const episodeText = movie.episode_current
    ? `Tập ${movie.episode_current}${movie.episode_total ? ` / ${movie.episode_total}` : ''}`
    : null
  const rating = movie.tmdb?.vote_average
    ? Math.round(movie.tmdb.vote_average * 10) / 10
    : null

  return (
    <div
      className="relative w-full overflow-hidden"
      style={{ height: '80vh', minHeight: '500px', background: '#000' }}
    >
      {/* Backdrop */}
      <img
        src={bgImg}
        alt={movie.name}
        className="absolute inset-0 w-full h-full object-cover"
        onError={(e) => { e.target.style.display = 'none' }}
      />

      {/* Gradient: right fade */}
      <div
        className="absolute inset-0"
        style={{
          background: 'linear-gradient(to right, rgba(0,0,0,0.9) 0%, rgba(0,0,0,0.6) 45%, rgba(0,0,0,0.05) 100%)',
        }}
      />
      {/* Gradient: bottom fade */}
      <div
        className="absolute inset-0"
        style={{
          background: 'linear-gradient(to top, rgba(0,0,0,0.85) 0%, transparent 30%)',
        }}
      />

      {/* Content — anchored to bottom-left */}
      <div
        className="absolute inset-0 flex flex-col justify-end px-8 md:px-12 gap-4"
        style={{ maxWidth: '580px', paddingBottom: '80px' }}
      >
        {/* Badges */}
        {(movie.quality || movie.lang || rating) && (
          <div className="flex items-center gap-2 flex-wrap">
            {movie.quality && (
              <span
                className="text-[11px] font-bold px-2 py-0.5 rounded-sm uppercase tracking-wide leading-none"
                style={{ background: '#e50914', color: '#fff' }}
              >
                {movie.quality}
              </span>
            )}
            {movie.lang && (
              <span
                className="text-[11px] font-bold px-2 py-0.5 rounded-sm border uppercase tracking-wide leading-none"
                style={{ background: 'rgba(255,255,255,0.12)', color: '#fff', borderColor: 'rgba(255,255,255,0.2)' }}
              >
                {movie.lang}
              </span>
            )}
            {rating && (
              <span className="font-mono text-[12px] font-bold leading-none" style={{ color: '#46d369' }}>
                ★ {rating}
              </span>
            )}
          </div>
        )}

        {/* Title */}
        <h1
          className="font-black text-white leading-tight"
          style={{ fontSize: 'clamp(32px, 5vw, 56px)', letterSpacing: '-1.5px', lineHeight: 1.05 }}
        >
          {movie.name}
        </h1>

        {/* Meta row */}
        {(movie.year || country || episodeText) && (
          <div className="flex items-center gap-3 text-base flex-wrap" style={{ color: '#b3b3b3' }}>
            {movie.year && <span>{movie.year}</span>}
            {country && (
              <>
                <span className="w-1 h-1 rounded-full flex-shrink-0" style={{ background: '#737373' }} />
                <span>{country}</span>
              </>
            )}
            {episodeText && (
              <>
                <span className="w-1 h-1 rounded-full flex-shrink-0" style={{ background: '#737373' }} />
                <span>{episodeText}</span>
              </>
            )}
          </div>
        )}

        {/* Description */}
        {desc && (
          <p
            className="text-base leading-relaxed line-clamp-3"
            style={{ color: '#b3b3b3', maxWidth: '420px' }}
          >
            {desc}
          </p>
        )}

        {/* Buttons */}
        <div className="flex items-center gap-3 flex-wrap">
          <button
            onClick={() => navigate(`/phim/${movie.slug}`)}
            className="inline-flex items-center gap-2 font-bold text-white transition-opacity hover:opacity-85"
            style={{ background: '#e50914', padding: '14px 28px', borderRadius: '4px', fontSize: '16px' }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
              <polygon points="5,3 19,12 5,21" />
            </svg>
            Xem Ngay
          </button>
          <button
            onClick={() => navigate(`/phim/${movie.slug}`)}
            className="inline-flex items-center gap-2 font-bold text-white transition-colors"
            style={{ background: 'rgba(109,109,110,0.7)', padding: '14px 28px', borderRadius: '4px', fontSize: '16px' }}
            onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(109,109,110,0.5)' }}
            onMouseLeave={(e) => { e.currentTarget.style.background = 'rgba(109,109,110,0.7)' }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="8" x2="12" y2="16" />
              <line x1="8" y1="12" x2="16" y2="12" />
            </svg>
            Chi Tiết
          </button>
        </div>
      </div>

      {/* Bottom vignette */}
      <div
        className="absolute bottom-0 left-0 right-0"
        style={{ height: '120px', background: 'linear-gradient(to top, #000000, transparent)', zIndex: 5 }}
      />
    </div>
  )
}
