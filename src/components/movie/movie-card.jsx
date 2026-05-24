import { Link } from 'react-router-dom'
import { getImageUrl } from '../../services/ophim-api.js'

export default function MovieCard({ movie }) {
  if (!movie) return null

  const { name, slug, thumb_url, year, quality, lang, episode_current, origin_name } = movie

  return (
    <Link
      to={`/phim/${slug}`}
      className="group flex-shrink-0 flex flex-col"
      style={{ width: '185px' }}
    >
      {/* Thumbnail */}
      <div
        className="relative overflow-hidden"
        style={{
          width: '100%',
          paddingBottom: '150%',
          height: 0,
          borderRadius: '0.5rem',
          background: 'var(--bg-3)',
          transition: 'transform 350ms ease',
        }}
      >
        <img
          src={getImageUrl(thumb_url)}
          alt={name}
          loading="lazy"
          className="absolute inset-0 w-full h-full object-cover"
          style={{ transition: 'opacity 250ms' }}
          onError={(e) => { e.target.style.display = 'none' }}
        />

        {/* Hover dim */}
        <div
          className="absolute inset-0 opacity-0 group-hover:opacity-100"
          style={{ background: 'rgba(0,0,0,0.35)', transition: 'opacity 200ms' }}
        />

        {/* Play icon on hover */}
        <div
          className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100"
          style={{ transition: 'opacity 200ms' }}
        >
          <div
            className="flex items-center justify-center rounded-full"
            style={{ width: '40px', height: '40px', background: 'rgba(0,0,0,0.7)', border: '2px solid rgba(255,255,255,0.8)' }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="white">
              <polygon points="5,3 19,12 5,21" />
            </svg>
          </div>
        </div>

        {/* Quality badge */}
        {quality && (
          <span
            className="absolute top-1.5 left-1.5 font-bold uppercase leading-none"
            style={{ fontSize: '10px', padding: '3px 6px', borderRadius: '4px', background: 'var(--primary)', color: 'var(--primary-btn-text)' }}
          >
            {quality}
          </span>
        )}

        {/* Episode / lang badge */}
        {(episode_current || lang) && (
          <span
            className="absolute bottom-1.5 right-1.5 font-mono uppercase leading-none"
            style={{ fontSize: '9px', padding: '3px 5px', borderRadius: '4px', background: 'rgba(0,0,0,0.8)', color: 'rgba(255,255,255,0.85)' }}
          >
            {episode_current || lang}
          </span>
        )}
      </div>

      {/* Info — centered */}
      <div className="pt-2 pb-1 text-center">
        <p
          className="text-sm font-semibold leading-snug line-clamp-2"
          style={{ color: '#fff', minHeight: '2.5rem' }}
        >
          {name}
        </p>
        {(year || origin_name) && (
          <p className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>
            {year || ''}{origin_name ? ` · ${origin_name.slice(0, 18)}` : ''}
          </p>
        )}
      </div>
    </Link>
  )
}
