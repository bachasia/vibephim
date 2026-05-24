import { Link } from 'react-router-dom'
import { getImageUrl } from '../../services/ophim-api.js'

export default function MovieCard({ movie }) {
  if (!movie) return null

  const { name, slug, thumb_url, year, quality, lang, episode_current, origin_name } = movie

  return (
    <Link
      to={`/phim/${slug}`}
      className="group relative flex-shrink-0 block w-[150px] overflow-hidden rounded-sm cursor-pointer"
      style={{ background: '#232323', transition: 'transform 400ms ease, box-shadow 400ms ease' }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'scale(1.05)'
        e.currentTarget.style.boxShadow = '0 10px 40px rgba(0,0,0,0.7)'
        e.currentTarget.style.zIndex = '10'
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'scale(1)'
        e.currentTarget.style.boxShadow = 'none'
        e.currentTarget.style.zIndex = ''
      }}
    >
      {/* Poster */}
      <div className="relative aspect-[2/3] overflow-hidden" style={{ background: '#232323' }}>
        <img
          src={getImageUrl(thumb_url)}
          alt={name}
          loading="lazy"
          className="w-full h-full object-cover"
          onError={(e) => { e.target.style.display = 'none' }}
        />

        {/* Hover overlay */}
        <div
          className="absolute inset-0 opacity-0 group-hover:opacity-100 flex flex-col justify-end p-2 gap-1"
          style={{
            background: 'linear-gradient(to top, rgba(0,0,0,0.95) 0%, rgba(0,0,0,0.4) 55%, transparent 100%)',
            transition: 'opacity 200ms',
          }}
        >
          <p className="text-white text-[13px] font-bold leading-tight line-clamp-2">{name}</p>
          {origin_name && (
            <p className="text-[11px] font-mono" style={{ color: 'rgba(255,255,255,0.6)' }}>
              {year ? `${year} · ` : ''}{quality || ''}
            </p>
          )}
        </div>

        {/* Quality badge — top right */}
        {quality && (
          <span
            className="absolute top-1.5 right-1.5 font-mono text-[9px] font-bold px-1.5 py-0.5 rounded-sm uppercase leading-none"
            style={{ background: '#e50914', color: '#fff' }}
          >
            {quality}
          </span>
        )}

        {/* Episode / lang badge — bottom left, above info panel */}
        {(episode_current || lang) && (
          <span
            className="absolute left-1.5 font-mono text-[9px] font-bold px-1.5 py-0.5 rounded-sm uppercase leading-none"
            style={{ bottom: '44px', background: 'rgba(0,0,0,0.8)', color: 'rgba(255,255,255,0.85)' }}
          >
            {episode_current || lang}
          </span>
        )}
      </div>

      {/* Info panel */}
      <div
        className="px-2 pt-2 pb-3 transition-colors duration-200"
        style={{ background: '#232323' }}
      >
        <p className="text-[13px] font-semibold truncate" style={{ color: '#ffffff' }}>{name}</p>
        {year && (
          <p className="text-[11px] mt-0.5 font-mono" style={{ color: '#737373' }}>{year}</p>
        )}
      </div>
    </Link>
  )
}
