import { useState } from 'react'
import { Link } from 'react-router-dom'
import { getImageUrl } from '../../services/ophim-api.js'
import { useFavorites } from '../../contexts/favorites-context.jsx'

function sanitize(html = '') {
  return html.replace(/<script[\s\S]*?<\/script>/gi, '').replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim()
}

function Badge({ children, primary }) {
  return (
    <span
      className="inline-flex items-center text-[11px] font-mono px-1.5 py-0.5 rounded-sm shrink-0"
      style={primary
        ? { background: 'var(--primary)', color: 'var(--primary-btn-text)', fontWeight: 700 }
        : { background: 'var(--bg-3)', color: 'var(--text-base)', border: '1px solid rgba(255,255,255,0.1)' }
      }
    >
      {children}
    </span>
  )
}

export default function WatchMovieInfo({ movie, slug, currentEpName }) {
  const [expanded, setExpanded] = useState(false)
  const { isFavorite, addFavorite, removeFavorite } = useFavorites()

  if (!movie) return null

  const { name, origin_name, thumb_url, year, quality, lang, time, episode_current, episode_total, content } = movie
  const synopsis = content ? sanitize(content) : ''
  const favorited = isFavorite(slug)
  const isCompleted = movie.status === 'completed'

  return (
    <div className="py-4" style={{ borderBottom: '1px solid var(--border-color)' }}>
      <div className="flex gap-3">
        {/* Thumbnail */}
        <Link to={`/phim/${slug}`} className="shrink-0">
          <div
            className="rounded-sm overflow-hidden"
            style={{ width: '56px', aspectRatio: '2/3', background: 'var(--bg-3)' }}
          >
            <img
              src={getImageUrl(thumb_url)}
              alt={name}
              className="w-full h-full object-cover"
              onError={e => { e.target.style.display = 'none' }}
            />
          </div>
        </Link>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <Link to={`/phim/${slug}`} className="font-bold text-white text-base leading-tight hover:opacity-80 transition-opacity line-clamp-1">
                {name}
              </Link>
              {currentEpName && (
                <p className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>
                  {/^\d+$/.test(currentEpName) ? `Tập ${currentEpName}` : currentEpName}
                </p>
              )}
              <div className="flex flex-wrap gap-1 mt-1.5">
                {quality && <Badge primary>{quality}</Badge>}
                {lang && <Badge>{lang}</Badge>}
                {year && <Badge>{year}</Badge>}
                {(episode_current || episode_total) && (
                  <Badge>
                    {isCompleted
                      ? `Hoàn Tất (${episode_total || episode_current})`
                      : episode_total && !String(episode_current || '').includes('/')
                        ? `${episode_current}/${episode_total}`
                        : (episode_current || episode_total)
                    }
                  </Badge>
                )}
                {time && <Badge>{time}</Badge>}
              </div>
            </div>

            {/* Action buttons */}
            <div className="flex items-center gap-1.5 shrink-0">
              <button
                onClick={() => favorited ? removeFavorite(slug) : addFavorite(movie)}
                className="flex items-center gap-1 text-[12px] font-medium px-2.5 py-1.5 rounded-sm transition-colors"
                style={{
                  background: favorited ? 'rgba(255,216,117,0.12)' : 'var(--bg-3)',
                  color: favorited ? 'var(--primary)' : 'var(--text-base)',
                  border: favorited ? '1px solid rgba(255,216,117,0.3)' : '1px solid rgba(255,255,255,0.1)',
                }}
              >
                <svg width="11" height="11" viewBox="0 0 512 512" fill={favorited ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="45">
                  <path d="M47.6 300.4L228.3 469.1c7.5 7 17.4 10.9 27.7 10.9s20.2-3.9 27.7-10.9L464.4 300.4c30.4-28.3 47.6-68 47.6-109.5v-5.8c0-69.9-50.5-129.5-119.4-141C347 36.5 300.6 51.4 268 84L256 96 244 84c-32.6-32.6-79-47.5-124.6-39.9C50.5 55.6 0 115.2 0 185.1v5.8c0 41.5 17.2 81.2 47.6 109.5z"/>
                </svg>
                {favorited ? 'Đã lưu' : 'Lưu'}
              </button>
              <Link
                to={`/phim/${slug}`}
                className="text-[12px] font-medium px-2.5 py-1.5 rounded-sm transition-colors"
                style={{ background: 'var(--bg-3)', color: 'var(--text-base)', border: '1px solid rgba(255,255,255,0.1)' }}
                onMouseEnter={e => { e.currentTarget.style.color = '#fff' }}
                onMouseLeave={e => { e.currentTarget.style.color = 'var(--text-base)' }}
              >
                Chi tiết
              </Link>
            </div>
          </div>

          {/* Synopsis */}
          {synopsis && (
            <div className="mt-3">
              <p
                className="text-sm leading-relaxed"
                style={{
                  color: 'var(--text-base)',
                  display: '-webkit-box',
                  WebkitLineClamp: expanded ? 'unset' : 3,
                  WebkitBoxOrient: 'vertical',
                  overflow: expanded ? 'visible' : 'hidden',
                }}
              >
                {synopsis}
              </p>
              {synopsis.length > 200 && (
                <button
                  onClick={() => setExpanded(v => !v)}
                  className="text-xs mt-1 transition-colors"
                  style={{ color: 'var(--primary)' }}
                >
                  {expanded ? 'Rút gọn ▲' : 'Xem thêm ▼'}
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
