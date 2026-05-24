import { useParams, Link, useNavigate } from 'react-router-dom'
import { useEffect } from 'react'
import { useMovieDetail } from '../hooks/use-movie-detail.js'
import { getImageUrl } from '../services/ophim-api.js'
import EpisodeSection from '../components/movie/episode-section.jsx'

import { useFavorites } from '../contexts/favorites-context.jsx'
import { SkeletonBanner } from '../components/ui/skeleton.jsx'

// Strip script/style tags from HTML to prevent XSS
function sanitizeHtml(html = '') {
  return html.replace(/<script[\s\S]*?<\/script>/gi, '').replace(/<style[\s\S]*?<\/style>/gi, '')
}

function Chip({ to, label }) {
  return (
    <Link
      to={to}
      className="inline-block text-sm transition-colors duration-200"
      style={{
        padding: '4px 12px',
        borderRadius: '2px',
        background: 'rgba(255,255,255,0.08)',
        border: '1px solid rgba(255,255,255,0.1)',
        color: '#b3b3b3',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.background = 'rgba(229,9,20,0.15)'
        e.currentTarget.style.borderColor = '#e50914'
        e.currentTarget.style.color = '#ffffff'
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.background = 'rgba(255,255,255,0.08)'
        e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)'
        e.currentTarget.style.color = '#b3b3b3'
      }}
    >
      {label}
    </Link>
  )
}

function MetaRow({ label, children }) {
  return (
    <div className="flex gap-4 items-start text-sm">
      <span
        className="flex-shrink-0 font-mono text-[12px] pt-0.5"
        style={{ width: '88px', color: '#737373' }}
      >
        {label}
      </span>
      <div className="flex-1 min-w-0">{children}</div>
    </div>
  )
}

function DetailSkeleton() {
  return (
    <div className="min-h-screen animate-pulse" style={{ background: '#000' }}>
      <SkeletonBanner />
      <div className="px-8 py-8 flex gap-8">
        <div className="shrink-0 rounded-sm" style={{ width: '180px', aspectRatio: '2/3', background: 'rgba(255,255,255,0.1)' }} />
        <div className="flex-1 space-y-3 pt-28">
          <div className="h-8 rounded w-2/3" style={{ background: 'rgba(255,255,255,0.1)' }} />
          <div className="h-4 rounded w-1/3" style={{ background: 'rgba(255,255,255,0.08)' }} />
          <div className="h-4 rounded w-1/2" style={{ background: 'rgba(255,255,255,0.08)' }} />
        </div>
      </div>
    </div>
  )
}

export default function DetailPage() {
  const { slug } = useParams()
  const navigate = useNavigate()
  const { movie, episodes, loading, error } = useMovieDetail(slug)
  const { isFavorite, addFavorite, removeFavorite } = useFavorites()

  useEffect(() => {
    if (movie) document.title = `${movie.name} - VibePHim`
  }, [movie])

  if (loading) return <DetailSkeleton />

  if (error || !movie) {
    return (
      <div className="min-h-screen pt-20 flex items-center justify-center" style={{ background: '#000' }}>
        <p className="text-sm" style={{ color: '#737373' }}>{error || 'Không tìm thấy phim.'}</p>
      </div>
    )
  }

  const {
    name, origin_name, thumb_url, poster_url, year, quality, lang, time,
    episode_current, episode_total, status,
    category = [], country = [],
    director = [], actor = [],
    content, trailer_url,
  } = movie

  const backdropUrl = getImageUrl(poster_url || thumb_url)
  const synopsis = content
    ? sanitizeHtml(content).replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim()
    : ''

  const isCompleted = status === 'completed' || (episode_current && episode_current === episode_total)
  const favorited = isFavorite(slug)

  const firstEp = episodes?.[0]?.server_data?.[0]

  return (
    <div className="min-h-screen text-white" style={{ background: '#000' }}>
      {/* Backdrop */}
      <div
        className="relative overflow-hidden"
        style={{ height: '56vh', minHeight: '320px' }}
      >
        <img
          src={backdropUrl}
          alt={name}
          className="w-full h-full object-cover object-top"
          style={{ opacity: 0.6 }}
          onError={(e) => { e.target.style.display = 'none' }}
        />
        {/* Gradient: left to right */}
        <div
          className="absolute inset-0"
          style={{
            background: 'linear-gradient(to right, #000000 0%, transparent 50%)',
          }}
        />
        {/* Gradient: bottom to top */}
        <div
          className="absolute inset-0"
          style={{
            background: 'linear-gradient(to top, #000000 0%, rgba(0,0,0,0.2) 60%, transparent 100%)',
          }}
        />
      </div>

      {/* Main content — overlaps backdrop */}
      <div
        className="relative z-10 flex gap-7 px-8"
        style={{ marginTop: '-120px', paddingBottom: '28px' }}
      >
        {/* Poster */}
        <div
          className="flex-shrink-0 rounded-sm overflow-hidden hidden sm:block"
          style={{ width: '180px', aspectRatio: '2/3', boxShadow: '0 8px 32px rgba(0,0,0,0.8)' }}
        >
          <img
            src={getImageUrl(thumb_url)}
            alt={name}
            className="w-full h-full object-cover"
            onError={(e) => { e.target.style.display = 'none' }}
          />
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0" style={{ paddingTop: '120px' }}>
          <h1
            className="font-black text-white leading-tight mb-2"
            style={{ fontSize: 'clamp(28px, 4vw, 40px)', letterSpacing: '-1px' }}
          >
            {name}
          </h1>
          {origin_name && (
            <p className="text-sm mb-5 font-mono" style={{ color: '#b3b3b3' }}>{origin_name}</p>
          )}

          {/* Badges */}
          <div className="flex flex-wrap gap-2 mb-4">
            {quality && (
              <span
                className="font-mono text-[11px] font-bold px-3 py-1 rounded-sm"
                style={{ background: '#e50914', color: '#fff' }}
              >
                {quality}
              </span>
            )}
            {lang && (
              <span
                className="font-mono text-[11px] font-bold px-3 py-1 rounded-sm"
                style={{ background: '#2d2d2d', color: '#b3b3b3', border: '1px solid rgba(255,255,255,0.2)' }}
              >
                {lang}
              </span>
            )}
            {year && (
              <span
                className="font-mono text-[11px] font-bold px-3 py-1 rounded-sm"
                style={{ background: '#2d2d2d', color: '#b3b3b3', border: '1px solid rgba(255,255,255,0.2)' }}
              >
                {year}
              </span>
            )}
            {time && (
              <span
                className="font-mono text-[11px] font-bold px-3 py-1 rounded-sm"
                style={{ background: '#2d2d2d', color: '#b3b3b3', border: '1px solid rgba(255,255,255,0.2)' }}
              >
                {time}
              </span>
            )}
          </div>

          {/* Status */}
          {status && (
            <div
              className="flex items-center gap-2 text-sm font-semibold mb-4"
              style={{ color: isCompleted ? '#46d369' : '#46d369' }}
            >
              <span
                className="w-1.5 h-1.5 rounded-full flex-shrink-0"
                style={{ background: '#46d369' }}
              />
              {isCompleted
                ? `Hoàn tất${episode_total ? ` · ${episode_total} tập` : ''}`
                : `Đang chiếu · Tập ${episode_current || '?'}${episode_total ? ` / ${episode_total}` : ''}`
              }
            </div>
          )}

          {/* Meta rows */}
          <div className="flex flex-col gap-3 mb-5">
            {category.length > 0 && (
              <MetaRow label="Thể loại">
                <div className="flex flex-wrap gap-1.5">
                  {category.map((c) => <Chip key={c.slug} to={`/the-loai/${c.slug}`} label={c.name} />)}
                </div>
              </MetaRow>
            )}
            {country.length > 0 && (
              <MetaRow label="Quốc gia">
                <div className="flex flex-wrap gap-1.5">
                  {country.map((c) => <Chip key={c.slug} to={`/quoc-gia/${c.slug}`} label={c.name} />)}
                </div>
              </MetaRow>
            )}
            {director?.length > 0 && director[0] !== 'Đang cập nhật' && (
              <MetaRow label="Đạo diễn">
                <span className="text-sm text-white">{director.join(', ')}</span>
              </MetaRow>
            )}
            {actor?.length > 0 && actor[0] !== 'Đang cập nhật' && (
              <MetaRow label="Diễn viên">
                <span className="text-sm line-clamp-2" style={{ color: '#b3b3b3' }}>{actor.join(', ')}</span>
              </MetaRow>
            )}
          </div>

          {/* Action buttons */}
          <div className="flex flex-wrap gap-3 mt-5">
            <button
              onClick={() => firstEp
                ? navigate(`/xem/${slug}/${firstEp.slug}`)
                : navigate(`/phim/${slug}`)
              }
              className="inline-flex items-center gap-2 font-bold text-sm text-white transition-opacity hover:opacity-85"
              style={{ background: '#e50914', padding: '10px 20px', borderRadius: '4px' }}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                <polygon points="5,3 19,12 5,21" />
              </svg>
              Xem Ngay
            </button>

            <button
              onClick={() => favorited ? removeFavorite(slug) : addFavorite(movie)}
              className="inline-flex items-center gap-2 font-semibold text-sm transition-colors duration-200"
              style={{
                padding: '10px 16px',
                borderRadius: '4px',
                background: favorited ? 'rgba(229,9,20,0.15)' : 'rgba(109,109,110,0.5)',
                color: favorited ? '#e50914' : '#ffffff',
                border: favorited ? '1px solid #e50914' : 'none',
              }}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill={favorited ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2">
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
              </svg>
              {favorited ? 'Đã yêu thích' : 'Yêu Thích'}
            </button>

            {trailer_url && (
              <a
                href={trailer_url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 font-semibold text-sm text-white transition-colors duration-200"
                style={{ padding: '10px 16px', borderRadius: '4px', background: 'rgba(109,109,110,0.5)' }}
                onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(109,109,110,0.35)' }}
                onMouseLeave={(e) => { e.currentTarget.style.background = 'rgba(109,109,110,0.5)' }}
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                  <polygon points="5,3 19,12 5,21" />
                </svg>
                Trailer
              </a>
            )}
          </div>
        </div>
      </div>

      {/* Synopsis */}
      {synopsis && (
        <div className="px-8 pb-7" style={{ maxWidth: '760px' }}>
          <h2
            className="text-xl font-bold mb-4 pb-4"
            style={{ borderBottom: '1px solid rgba(255,255,255,0.1)' }}
          >
            Nội Dung
          </h2>
          <p className="text-base leading-relaxed" style={{ color: '#b3b3b3' }}>
            {synopsis}
          </p>
        </div>
      )}

      {/* Episodes */}
      <div className="px-8 pb-8">
        <EpisodeSection episodes={episodes} movieSlug={slug} />
      </div>

    </div>
  )
}
