import { useState, useEffect, useCallback } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { getImageUrl, getMovieDetail } from '../../services/ophim-api.js'
import { MOVIE_TYPES } from '../../utils/constants.js'
import { SkeletonBanner } from '../ui/skeleton.jsx'

const FILTER_TABS = [
  { label: 'Đề xuất', to: '/' },
  { label: 'Phim bộ', to: `/browse?type=${MOVIE_TYPES.SERIES}` },
  { label: 'Phim lẻ', to: `/browse?type=${MOVIE_TYPES.MOVIE}` },
  { label: 'Hoạt hình', to: `/browse?type=${MOVIE_TYPES.ANIME}` },
  { label: 'Hàn Quốc', to: '/quoc-gia/han-quoc' },
  { label: 'Âu Mỹ', to: '/quoc-gia/au-my' },
]

const AUTO_ROTATE_MS = 7000
const POOL_SIZE = 8

export default function HeroBanner({ movies = [], loading }) {
  const navigate = useNavigate()
  const pool = movies.slice(0, POOL_SIZE)

  const [activeIdx, setActiveIdx] = useState(0)
  const [detail, setDetail] = useState(null)
  const [animKey, setAnimKey] = useState(0)

  const switchTo = useCallback((idx) => {
    setActiveIdx(idx)
    setDetail(null)
    setAnimKey((k) => k + 1)
  }, [])

  // Auto-rotate
  useEffect(() => {
    if (pool.length < 2) return
    const id = setInterval(() => {
      setActiveIdx((i) => {
        const next = (i + 1) % Math.min(pool.length, POOL_SIZE)
        setDetail(null)
        setAnimKey((k) => k + 1)
        return next
      })
    }, AUTO_ROTATE_MS)
    return () => clearInterval(id)
  }, [pool.length])

  const current = pool[activeIdx] || null

  // Fetch detail for description / extra fields
  useEffect(() => {
    if (!current?.slug) return
    let cancelled = false
    getMovieDetail(current.slug)
      .then((d) => { if (!cancelled) setDetail(d.movie || null) })
      .catch(() => {})
    return () => { cancelled = true }
  }, [current?.slug])

  if (loading) return <SkeletonBanner />
  if (!current) return null

  const movie = detail ? { ...current, ...detail } : current

  const coverImg = getImageUrl(movie.poster_url || movie.thumb_url)
  const desc = movie.content
    ? movie.content.replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim().slice(0, 200)
    : null
  const rating = movie.tmdb?.vote_average
    ? (Math.round(movie.tmdb.vote_average * 10) / 10).toFixed(1)
    : null

  return (
    <div
      className="relative w-full overflow-hidden"
      style={{ height: '860px', background: 'var(--bg-color)', marginBottom: '-120px' }}
    >
      {/* Cover image — right-side focused with mask fade on left */}
      <div
        key={`cover-${animKey}`}
        className="absolute inset-0 animate-cover-in"
        style={{
          maskImage: 'linear-gradient(90deg, transparent 5%, rgba(0,0,0,0.15) 20%, #000 45%, #000 85%, transparent 100%)',
          WebkitMaskImage: 'linear-gradient(90deg, transparent 5%, rgba(0,0,0,0.15) 20%, #000 45%, #000 85%, transparent 100%)',
        }}
      >
        <img
          src={coverImg}
          alt={movie.name}
          className="w-full h-full object-cover"
          onError={(e) => { e.target.style.opacity = '0' }}
        />
      </div>

      {/* Bottom gradient — fades into page background */}
      <div
        className="absolute bottom-0 left-0 right-0 z-10"
        style={{ height: '220px', background: 'linear-gradient(0deg, var(--bg-color), rgba(25,27,36,0))' }}
      />

      {/* Left dark overlay — ensures text readability */}
      <div
        className="absolute inset-0"
        style={{ background: 'linear-gradient(90deg, rgba(25,27,36,0.95) 0%, rgba(25,27,36,0.7) 35%, transparent 65%)' }}
      />

      {/* Slide content — left side */}
      <div
        key={`content-${animKey}`}
        className="absolute inset-0 flex flex-col justify-end z-20 animate-slide-in"
        style={{ padding: '0 50px 150px', maxWidth: '650px' }}
      >
        {/* Badges */}
        <div className="flex items-center gap-2 flex-wrap mb-3">
          {movie.quality && (
            <span
              className="font-bold uppercase leading-none"
              style={{ fontSize: '12px', padding: '4px 8px', borderRadius: '4px', background: 'var(--primary)', color: 'var(--primary-btn-text)' }}
            >
              {movie.quality}
            </span>
          )}
          {movie.lang && (
            <span
              className="font-medium uppercase leading-none"
              style={{ fontSize: '11px', padding: '4px 8px', borderRadius: '4px', background: 'rgba(255,255,255,0.12)', color: '#fff', border: '1px solid rgba(255,255,255,0.2)' }}
            >
              {movie.lang}
            </span>
          )}
          {rating && (
            <span className="font-bold" style={{ fontSize: '13px', color: 'var(--primary)' }}>
              ★ {rating}
            </span>
          )}
        </div>

        {/* Title */}
        <h1
          className="font-bold text-white leading-tight mb-3"
          style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', textShadow: '0 2px 1px rgba(0,0,0,0.3)' }}
        >
          {movie.name}
        </h1>

        {/* Origin name + year */}
        {(movie.origin_name || movie.year) && (
          <p className="mb-3" style={{ fontSize: '14px', color: 'var(--text-base)' }}>
            {movie.origin_name && <span>{movie.origin_name}</span>}
            {movie.origin_name && movie.year && <span className="mx-2">·</span>}
            {movie.year && <span>{movie.year}</span>}
          </p>
        )}

        {/* Description */}
        {desc && (
          <p
            className="mb-5 line-clamp-3 leading-relaxed"
            style={{ fontSize: '14px', color: 'var(--text-base)', maxWidth: '500px' }}
          >
            {desc}
          </p>
        )}

        {/* CTA buttons */}
        <div className="flex items-center gap-3 flex-wrap">
          <button
            onClick={() => navigate(`/phim/${movie.slug}`)}
            className="inline-flex items-center gap-2 font-bold transition-opacity hover:opacity-85"
            style={{ padding: '12px 28px', borderRadius: '6px', fontSize: '15px', background: 'var(--primary)', color: 'var(--primary-btn-text)' }}
          >
            <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
              <polygon points="5,3 19,12 5,21" />
            </svg>
            Xem Ngay
          </button>
          <button
            onClick={() => navigate(`/phim/${movie.slug}`)}
            className="inline-flex items-center gap-2 font-medium text-white transition-colors"
            style={{ padding: '12px 24px', borderRadius: '6px', fontSize: '15px', background: 'rgba(255,255,255,0.12)', border: '1px solid rgba(255,255,255,0.2)' }}
            onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(255,255,255,0.2)' }}
            onMouseLeave={(e) => { e.currentTarget.style.background = 'rgba(255,255,255,0.12)' }}
          >
            Chi Tiết
          </button>
        </div>
      </div>

      {/* Thumbnail strip — bottom right */}
      {pool.length > 1 && (
        <div
          className="absolute z-30 flex items-center gap-2"
          style={{ bottom: '155px', right: '50px' }}
        >
          {pool.map((m, i) => (
            <button
              key={m.slug || i}
              onClick={() => switchTo(i)}
              className="flex-shrink-0 overflow-hidden transition-all duration-200"
              style={{
                width: '65px',
                height: '45px',
                borderRadius: '4px',
                border: `2px solid ${i === activeIdx ? 'var(--primary)' : 'transparent'}`,
                opacity: i === activeIdx ? 1 : 0.55,
                transform: i === activeIdx ? 'scale(1.08)' : 'scale(1)',
              }}
              onMouseEnter={(e) => { if (i !== activeIdx) e.currentTarget.style.opacity = '0.85' }}
              onMouseLeave={(e) => { if (i !== activeIdx) e.currentTarget.style.opacity = '0.55' }}
            >
              <img
                src={getImageUrl(m.thumb_url)}
                alt={m.name}
                className="w-full h-full object-cover"
                loading="lazy"
              />
            </button>
          ))}
        </div>
      )}

      {/* Category pills — bottom left above CTA overlap zone */}
      <nav
        className="absolute z-30 flex items-center gap-2 overflow-x-auto"
        style={{ bottom: '110px', left: '50px', right: '200px', scrollbarWidth: 'none' }}
        aria-label="Danh mục"
      >
        {FILTER_TABS.map((tab) => (
          <Link
            key={tab.to}
            to={tab.to}
            className="flex-shrink-0 font-medium transition-all duration-200"
            style={{
              padding: '6px 16px',
              borderRadius: '999px',
              fontSize: '13px',
              background: 'rgba(255,255,255,0.1)',
              color: '#e0e0e0',
              border: '1px solid rgba(255,255,255,0.12)',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'var(--primary)'
              e.currentTarget.style.color = 'var(--primary-btn-text)'
              e.currentTarget.style.borderColor = 'var(--primary)'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'rgba(255,255,255,0.1)'
              e.currentTarget.style.color = '#e0e0e0'
              e.currentTarget.style.borderColor = 'rgba(255,255,255,0.12)'
            }}
          >
            {tab.label}
          </Link>
        ))}
      </nav>

      {/* Progress dots */}
      {pool.length > 1 && (
        <div
          className="absolute z-30 flex items-center gap-1.5"
          style={{ bottom: '135px', right: '50px' }}
        >
          {pool.map((_, i) => (
            <button
              key={i}
              onClick={() => switchTo(i)}
              className="rounded-full transition-all duration-300"
              style={{
                width: i === activeIdx ? '20px' : '6px',
                height: '6px',
                background: i === activeIdx ? 'var(--primary)' : 'rgba(255,255,255,0.35)',
              }}
            />
          ))}
        </div>
      )}
    </div>
  )
}
