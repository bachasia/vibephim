import { useParams, Link, useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { useMovieDetail } from '../hooks/use-movie-detail.js'
import { getImageUrl } from '../services/ophim-api.js'
import EpisodeSection from '../components/movie/episode-section.jsx'
import { useFavorites } from '../contexts/favorites-context.jsx'
import { SkeletonBanner } from '../components/ui/skeleton.jsx'

function sanitizeHtml(html = '') {
  return html.replace(/<script[\s\S]*?<\/script>/gi, '').replace(/<style[\s\S]*?<\/style>/gi, '')
}

// ── Tag chips ────────────────────────────────────────────────────────────────
function TagImdb({ value }) {
  if (!value) return null
  return (
    <span
      className="inline-flex items-center font-mono text-[11px] font-bold px-2 py-0.5 rounded-sm"
      style={{ background: 'var(--primary)', color: 'var(--primary-btn-text)' }}
    >
      {value}
    </span>
  )
}

function TagClassic({ children }) {
  return (
    <span
      className="inline-flex items-center font-mono text-[11px] px-2 py-0.5 rounded-sm"
      style={{ background: 'var(--bg-3)', color: 'var(--text-base)', border: '1px solid rgba(255,255,255,0.1)' }}
    >
      {children}
    </span>
  )
}

function TagTopic({ to, children }) {
  return (
    <Link
      to={to}
      className="inline-flex items-center text-[11px] px-2 py-0.5 rounded-sm transition-colors duration-150"
      style={{ background: 'rgba(255,216,117,0.08)', color: 'var(--primary)', border: '1px solid rgba(255,216,117,0.2)' }}
      onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,216,117,0.15)' }}
      onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,216,117,0.08)' }}
    >
      {children}
    </Link>
  )
}

// ── Detail info line ─────────────────────────────────────────────────────────
function InfoLine({ label, children }) {
  return (
    <div className="flex gap-2 text-sm leading-relaxed">
      <span className="shrink-0 font-mono text-[12px] pt-0.5" style={{ width: '80px', color: '#737373' }}>
        {label}
      </span>
      <div className="flex-1 min-w-0" style={{ color: '#d4d4d4' }}>{children}</div>
    </div>
  )
}

// ── Status badge ─────────────────────────────────────────────────────────────
function StatusBadge({ isCompleted, episodeCurrent, episodeTotal }) {
  const text = isCompleted
    ? `Hoàn Tất (${episodeTotal || episodeCurrent || '?'})`
    : `Đang chiếu (${episodeCurrent || '?'})`

  return (
    <div className="flex items-center gap-1.5 text-xs font-semibold" style={{ color: '#46d369' }}>
      <svg viewBox="0 0 512 512" width="13" height="13" fill="currentColor">
        {isCompleted
          ? <path d="M256 512A256 256 0 1 0 256 0a256 256 0 1 0 0 512zM369 209L241 337c-9.4 9.4-24.6 9.4-33.9 0l-64-64c-9.4-9.4-9.4-24.6 0-33.9s24.6-9.4 33.9 0l47 47L335 175c9.4-9.4 24.6-9.4 33.9 0s9.4 24.6 0 33.9z"/>
          : <path d="M256 0a256 256 0 1 1 0 512A256 256 0 1 1 256 0zM232 120V256c0 8 4 15.5 10.7 20l96 64c11 7.4 25.9 4.5 33.3-6.5s4.5-25.9-6.5-33.3L280 243.2V120c0-13.3-10.7-24-24-24s-24 10.7-24 24z"/>
        }
      </svg>
      {text}
    </div>
  )
}

// ── Skeleton ─────────────────────────────────────────────────────────────────
function DetailSkeleton() {
  return (
    <div className="min-h-screen animate-pulse" style={{ background: 'var(--bg-color)' }}>
      <SkeletonBanner />
      <div className="px-4 sm:px-8 py-8 flex gap-8">
        <div className="shrink-0 rounded-sm hidden sm:block" style={{ width: '200px', aspectRatio: '2/3', background: 'rgba(255,255,255,0.1)' }} />
        <div className="flex-1 space-y-3 pt-4">
          <div className="h-8 rounded w-2/3" style={{ background: 'rgba(255,255,255,0.1)' }} />
          <div className="h-4 rounded w-1/3" style={{ background: 'rgba(255,255,255,0.08)' }} />
          <div className="h-4 rounded w-1/2" style={{ background: 'rgba(255,255,255,0.08)' }} />
        </div>
      </div>
    </div>
  )
}

// ── Action bar ───────────────────────────────────────────────────────────────
function ActionBar({ onPlay, favorited, onToggleFavorite, trailerUrl }) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <button
        onClick={onPlay}
        className="inline-flex items-center gap-2 font-bold text-sm transition-opacity hover:opacity-85 shrink-0"
        style={{ background: 'var(--primary)', color: 'var(--primary-btn-text)', padding: '10px 20px', borderRadius: '6px' }}
      >
        <svg width="13" height="13" viewBox="0 0 384 512" fill="currentColor">
          <path d="M73 39c-14.8-9.1-33.4-9.4-48.5-.9S0 62.6 0 80V432c0 17.4 9.4 33.4 24.5 41.9s33.7 8.1 48.5-.9L361 297c14.3-8.7 23-24.2 23-41s-8.7-32.2-23-41L73 39z"/>
        </svg>
        Xem Ngay
      </button>

      <button
        onClick={onToggleFavorite}
        className="inline-flex items-center gap-1.5 text-sm font-medium transition-colors duration-150"
        style={{
          padding: '9px 14px',
          borderRadius: '6px',
          background: favorited ? 'rgba(255,216,117,0.12)' : 'rgba(255,255,255,0.07)',
          color: favorited ? 'var(--primary)' : '#b3b3b3',
          border: favorited ? '1px solid rgba(255,216,117,0.3)' : '1px solid rgba(255,255,255,0.12)',
        }}
        onMouseEnter={e => {
          if (!favorited) { e.currentTarget.style.background = 'rgba(255,255,255,0.12)'; e.currentTarget.style.color = '#fff' }
        }}
        onMouseLeave={e => {
          if (!favorited) { e.currentTarget.style.background = 'rgba(255,255,255,0.07)'; e.currentTarget.style.color = '#b3b3b3' }
        }}
      >
        <svg width="13" height="13" viewBox="0 0 512 512" fill={favorited ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="40">
          <path d="M47.6 300.4L228.3 469.1c7.5 7 17.4 10.9 27.7 10.9s20.2-3.9 27.7-10.9L464.4 300.4c30.4-28.3 47.6-68 47.6-109.5v-5.8c0-69.9-50.5-129.5-119.4-141C347 36.5 300.6 51.4 268 84L256 96 244 84c-32.6-32.6-79-47.5-124.6-39.9C50.5 55.6 0 115.2 0 185.1v5.8c0 41.5 17.2 81.2 47.6 109.5z"/>
        </svg>
        {favorited ? 'Đã yêu thích' : 'Yêu thích'}
      </button>

      {trailerUrl && (
        <a
          href={trailerUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 text-sm font-medium text-white transition-colors duration-150"
          style={{ padding: '9px 14px', borderRadius: '6px', background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.12)' }}
          onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.12)' }}
          onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.07)' }}
        >
          <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><polygon points="5,3 19,12 5,21"/></svg>
          Trailer
        </a>
      )}
    </div>
  )
}

// ── Main page ─────────────────────────────────────────────────────────────────
export default function DetailPage() {
  const { slug } = useParams()
  const navigate = useNavigate()
  const { movie, episodes, loading, error } = useMovieDetail(slug)
  const { isFavorite, addFavorite, removeFavorite } = useFavorites()
  const [infoExpanded, setInfoExpanded] = useState(false)

  useEffect(() => {
    if (movie) document.title = `${movie.name} - VibePHim`
  }, [movie])

  if (loading) return <DetailSkeleton />

  if (error || !movie) {
    return (
      <div className="min-h-screen pt-28 flex items-center justify-center" style={{ background: 'var(--bg-color)' }}>
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

  function handlePlay() {
    if (firstEp) navigate(`/xem/${slug}/${firstEp.slug}`)
    else navigate(`/phim/${slug}`)
  }

  function handleToggleFavorite() {
    favorited ? removeFavorite(slug) : addFavorite(movie)
  }

  return (
    <div className="min-h-screen text-white" style={{ background: 'var(--bg-color)' }}>

      {/* ── Backdrop ── */}
      <div className="relative overflow-hidden" style={{ height: '320px' }}>
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `url(${backdropUrl})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center top',
            filter: 'blur(2px) brightness(0.55)',
            transform: 'scale(1.05)',
          }}
        />
        {/* Left-to-right gradient */}
        <div
          className="absolute inset-0"
          style={{ background: 'linear-gradient(to right, var(--bg-color) 0%, rgba(25,27,36,0.6) 40%, transparent 100%)' }}
        />
        {/* Bottom fade */}
        <div
          className="absolute inset-0"
          style={{ background: 'linear-gradient(to top, var(--bg-color) 0%, rgba(25,27,36,0.3) 50%, transparent 100%)' }}
        />
      </div>

      {/* ── Two-column layout ── */}
      <div
        className="relative mx-auto"
        style={{ maxWidth: '1200px', padding: '0 16px', marginTop: '-200px' }}
      >
        <div className="flex flex-col md:flex-row gap-6 lg:gap-8">

          {/* ── LEFT SIDEBAR (dc-side) ── */}
          <div className="shrink-0 w-full md:w-64 lg:w-72">

            {/* Poster */}
            <div
              className="mx-auto md:mx-0 rounded-sm overflow-hidden shadow-2xl"
              style={{ width: '160px', aspectRatio: '2/3', boxShadow: '0 12px 40px rgba(0,0,0,0.8)' }}
            >
              <img
                src={getImageUrl(thumb_url)}
                alt={name}
                className="w-full h-full object-cover"
                onError={e => { e.target.style.display = 'none' }}
              />
            </div>

            {/* Title block */}
            <div className="mt-4 text-center md:text-left">
              <h1
                className="font-black text-white leading-tight"
                style={{ fontSize: 'clamp(20px, 3vw, 26px)', letterSpacing: '-0.5px' }}
              >
                {name}
              </h1>
              {origin_name && (
                <p className="text-xs mt-1 font-mono" style={{ color: '#737373' }}>{origin_name}</p>
              )}
            </div>

            {/* Mobile: action bar right after title */}
            <div className="mt-4 md:hidden">
              <ActionBar
                onPlay={handlePlay}
                favorited={favorited}
                onToggleFavorite={handleToggleFavorite}
                trailerUrl={trailer_url}
              />
            </div>

            {/* Info toggle button (mobile: collapsible; desktop: always visible) */}
            <button
              className="mt-4 w-full flex items-center justify-center gap-2 text-sm font-medium md:hidden transition-colors"
              style={{
                padding: '9px 16px',
                borderRadius: '6px',
                background: 'rgba(255,255,255,0.07)',
                color: '#b3b3b3',
                border: '1px solid rgba(255,255,255,0.12)',
              }}
              onClick={() => setInfoExpanded(v => !v)}
            >
              Thông tin phim
              <svg
                width="12" height="12" viewBox="0 0 448 512" fill="currentColor"
                style={{ transform: infoExpanded ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.2s' }}
              >
                <path d="M201.4 374.6c12.5 12.5 32.8 12.5 45.3 0l160-160c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L224 306.7 86.6 169.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3l160 160z"/>
              </svg>
            </button>

            {/* Info section (always visible on md+, toggleable on mobile) */}
            <div className={`mt-4 space-y-3 ${infoExpanded ? 'block' : 'hidden'} md:block`}>
              {/* Tag row 1: quality, year, episodes */}
              <div className="flex flex-wrap gap-1.5">
                {quality && <TagImdb value={quality} />}
                {lang && <TagClassic>{lang}</TagClassic>}
                {year && <TagClassic>{year}</TagClassic>}
                {(episode_current || episode_total) && (
                  <TagClassic>
                    {isCompleted
                      ? `Hoàn Tất (${episode_total || episode_current})`
                      : episode_total && !String(episode_current || '').includes('/')
                        ? `${episode_current}/${episode_total}`
                        : (episode_current || episode_total)}
                  </TagClassic>
                )}
                {time && <TagClassic>{time}</TagClassic>}
              </div>

              {/* Tag row 2: genres */}
              {category.length > 0 && (
                <div className="flex flex-wrap gap-1.5">
                  {category.map(c => (
                    <TagTopic key={c.slug} to={`/the-loai/${c.slug}`}>{c.name}</TagTopic>
                  ))}
                </div>
              )}

              {/* Status */}
              {status && (
                <StatusBadge
                  isCompleted={isCompleted}
                  episodeCurrent={episode_current}
                  episodeTotal={episode_total}
                />
              )}

              {/* Description */}
              {synopsis && (
                <div className="text-sm leading-relaxed" style={{ color: '#a3a3a3' }}>
                  <p className="line-clamp-5">{synopsis}</p>
                </div>
              )}

              {/* Detail lines */}
              <div className="space-y-2 pt-1">
                {country.length > 0 && (
                  <InfoLine label="Quốc gia">
                    <div className="flex flex-wrap gap-1">
                      {country.map(c => (
                        <Link key={c.slug} to={`/quoc-gia/${c.slug}`} className="hover:text-white transition-colors">{c.name}</Link>
                      ))}
                    </div>
                  </InfoLine>
                )}
                {director?.length > 0 && director[0] !== 'Đang cập nhật' && (
                  <InfoLine label="Đạo diễn">
                    <span>{director.join(', ')}</span>
                  </InfoLine>
                )}
                {actor?.length > 0 && actor[0] !== 'Đang cập nhật' && (
                  <InfoLine label="Diễn viên">
                    <span className="line-clamp-3">{actor.join(', ')}</span>
                  </InfoLine>
                )}
              </div>
            </div>
          </div>

          {/* ── RIGHT MAIN (dc-main) ── */}
          <div className="flex-1 min-w-0 pt-0 md:pt-44">

            {/* Desktop: action bar */}
            <div className="hidden md:block mb-6">
              <ActionBar
                onPlay={handlePlay}
                favorited={favorited}
                onToggleFavorite={handleToggleFavorite}
                trailerUrl={trailer_url}
              />
            </div>

            {/* Divider */}
            <div style={{ borderBottom: '1px solid rgba(255,255,255,0.08)', marginBottom: '20px' }} />

            {/* Synopsis (desktop — shown inline in main column) */}
            {synopsis && (
              <div className="hidden md:block mb-6" style={{ maxWidth: '700px' }}>
                <h2 className="text-sm font-semibold mb-2 uppercase tracking-wide" style={{ color: '#737373' }}>
                  Nội dung
                </h2>
                <p className="text-sm leading-relaxed line-clamp-4" style={{ color: '#a3a3a3' }}>{synopsis}</p>
              </div>
            )}

            {/* Episodes */}
            <EpisodeSection episodes={episodes} movieSlug={slug} />
          </div>
        </div>
      </div>

      {/* Bottom padding */}
      <div style={{ height: '60px' }} />
    </div>
  )
}
