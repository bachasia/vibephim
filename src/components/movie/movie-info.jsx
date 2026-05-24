import { useState } from 'react'
import { Link } from 'react-router-dom'
import { getImageUrl } from '../../services/ophim-api.js'
import { useFavorites } from '../../contexts/favorites-context.jsx'
import TrailerModal from '../ui/trailer-modal.jsx'

function Chip({ to, label }) {
  return (
    <Link
      to={to}
      className="inline-block px-2 py-0.5 text-xs rounded-sm transition-colors"
      style={{ background: 'var(--bg-3)', color: 'var(--text-base)' }}
      onMouseEnter={(e) => { e.currentTarget.style.background = 'var(--bg-4)'; e.currentTarget.style.color = '#fff' }}
      onMouseLeave={(e) => { e.currentTarget.style.background = 'var(--bg-3)'; e.currentTarget.style.color = 'var(--text-base)' }}
    >
      {label}
    </Link>
  )
}

function MetaRow({ label, children }) {
  return (
    <div className="flex gap-2 text-sm">
      <span className="text-zinc-500 shrink-0 w-28">{label}</span>
      <span className="text-zinc-200">{children}</span>
    </div>
  )
}

// Strip script/style tags from HTML to prevent XSS
function sanitizeHtml(html = '') {
  return html.replace(/<script[\s\S]*?<\/script>/gi, '').replace(/<style[\s\S]*?<\/style>/gi, '')
}

export default function MovieInfo({ movie }) {
  const { isFavorite, addFavorite, removeFavorite } = useFavorites()
  const [trailerOpen, setTrailerOpen] = useState(false)
  if (!movie) return null

  const favorited = isFavorite(movie.slug)

  const {
    name, origin_name, poster_url, thumb_url, year, quality, lang, time,
    episode_current, episode_total, status,
    category = [], country = [],
    director = [], actor = [],
    content, trailer_url,
  } = movie

  const synopsis = content
    ? sanitizeHtml(content).replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim()
    : ''

  const isCompleted = status === 'completed' || episode_current === episode_total

  return (
    <div className="flex flex-col md:flex-row gap-8">
      {/* Poster */}
      <div className="shrink-0 mx-auto md:mx-0">
        <img
          src={getImageUrl(poster_url || thumb_url)}
          alt={name}
          className="w-44 md:w-52 aspect-[2/3] object-cover rounded-sm shadow-2xl"
          onError={(e) => { e.target.style.display = 'none' }}
        />
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <h1 className="text-2xl md:text-3xl font-black text-white leading-tight">{name}</h1>
        {origin_name && (
          <p className="text-zinc-400 text-base mt-1 mb-4">{origin_name}</p>
        )}

        {/* Badges */}
        <div className="flex flex-wrap gap-2 mb-5">
          {quality && (
            <span className="px-2 py-0.5 text-xs font-bold rounded-sm" style={{ background: 'var(--primary)', color: 'var(--primary-btn-text)' }}>
              {quality}
            </span>
          )}
          {lang && (
            <span className="px-2 py-0.5 text-xs font-medium rounded-sm bg-white/15 text-white">{lang}</span>
          )}
          {episode_current && (
            <span className="px-2 py-0.5 text-xs rounded-sm" style={{ background: 'var(--bg-3)', color: 'var(--text-base)' }}>
              {episode_current}{episode_total ? `/${episode_total}` : ''} tập
            </span>
          )}
          {status && (
            <span className={`px-2 py-0.5 text-xs rounded-sm ${isCompleted ? 'bg-green-900/60 text-green-400' : 'bg-yellow-900/60 text-yellow-400'}`}>
              {isCompleted ? 'Hoàn tất' : 'Đang chiếu'}
            </span>
          )}
        </div>

        {/* Metadata */}
        <div className="flex flex-col gap-2 mb-5">
          {year && <MetaRow label="Năm phát hành">{year}</MetaRow>}
          {time && <MetaRow label="Thời lượng">{time}</MetaRow>}
          {category.length > 0 && (
            <div className="flex gap-2 text-sm">
              <span className="text-zinc-500 shrink-0 w-28">Thể loại</span>
              <div className="flex flex-wrap gap-1.5">
                {category.map((c) => <Chip key={c.slug} to={`/the-loai/${c.slug}`} label={c.name} />)}
              </div>
            </div>
          )}
          {country.length > 0 && (
            <div className="flex gap-2 text-sm">
              <span className="text-zinc-500 shrink-0 w-28">Quốc gia</span>
              <div className="flex flex-wrap gap-1.5">
                {country.map((c) => <Chip key={c.slug} to={`/quoc-gia/${c.slug}`} label={c.name} />)}
              </div>
            </div>
          )}
          {director?.length > 0 && director[0] !== 'Đang cập nhật' && (
            <MetaRow label="Đạo diễn">{director.join(', ')}</MetaRow>
          )}
          {actor?.length > 0 && actor[0] !== 'Đang cập nhật' && (
            <MetaRow label="Diễn viên">
              <span className="line-clamp-2">{actor.join(', ')}</span>
            </MetaRow>
          )}
        </div>

        {/* Action buttons */}
        <div className="flex flex-wrap gap-3 mb-5">
          <button
            onClick={() => favorited ? removeFavorite(movie.slug) : addFavorite(movie)}
            className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-sm border transition-colors"
            style={favorited
              ? { background: 'var(--primary)', color: 'var(--primary-btn-text)', borderColor: 'var(--primary)' }
              : { background: 'transparent', color: 'var(--text-base)', borderColor: 'rgba(255,255,255,0.2)' }
            }
          >
            {favorited
              ? <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" /></svg>
              : <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" /></svg>
            }
            {favorited ? 'Đã yêu thích' : 'Yêu thích'}
          </button>

          {/* Trailer */}
          {trailer_url && (
            <button
              onClick={() => setTrailerOpen(true)}
              className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-white rounded-sm transition-colors"
              style={{ background: 'var(--bg-3)' }}
              onMouseEnter={(e) => { e.currentTarget.style.background = 'var(--bg-4)' }}
              onMouseLeave={(e) => { e.currentTarget.style.background = 'var(--bg-3)' }}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><polygon points="5,3 19,12 5,21" /></svg>
              Xem Trailer
            </button>
          )}
          {trailerOpen && <TrailerModal url={trailer_url} onClose={() => setTrailerOpen(false)} />}
        </div>

        {/* Synopsis */}
        {synopsis && (
          <div>
            <h2 className="text-sm font-semibold text-zinc-400 uppercase tracking-wide mb-2">Nội dung</h2>
            <p className="text-zinc-300 text-sm leading-relaxed">{synopsis}</p>
          </div>
        )}
      </div>
    </div>
  )
}
