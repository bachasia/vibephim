import { Link } from 'react-router-dom'
import { getImageUrl } from '../../services/ophim-api.js'

export default function RankedMovieCard({ movie, rank }) {
  if (!movie) return null

  const { name, slug, thumb_url, year, quality, lang, episode_current, origin_name, time } = movie

  return (
    <Link
      to={`/phim/${slug}`}
      className="group flex-shrink-0 flex flex-col"
      style={{ width: '230px' }}
    >
      {/* Poster */}
      <div
        className="relative overflow-hidden"
        style={{
          width: '100%',
          paddingBottom: '145%',
          height: 0,
          borderRadius: '0.6rem',
          background: 'var(--bg-3)',
          transition: 'transform 300ms ease',
        }}
      >
        <img
          src={getImageUrl(thumb_url)}
          alt={name}
          loading="lazy"
          className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          onError={(e) => { e.target.style.display = 'none' }}
        />

        {/* Hover dim */}
        <div
          className="absolute inset-0 opacity-0 group-hover:opacity-100 flex items-center justify-center"
          style={{ background: 'rgba(0,0,0,0.4)', transition: 'opacity 200ms' }}
        >
          <div
            className="rounded-full flex items-center justify-center"
            style={{ width: '44px', height: '44px', background: 'rgba(0,0,0,0.75)', border: '2px solid rgba(255,255,255,0.85)' }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="white"><polygon points="5,3 19,12 5,21" /></svg>
          </div>
        </div>

        {/* Quality badge — top right */}
        {quality && quality !== 'Trailer' && (
          <span
            className="absolute top-2 right-2 font-bold uppercase leading-none"
            style={{ fontSize: '10px', padding: '3px 7px', borderRadius: '4px', background: 'var(--primary)', color: 'var(--primary-btn-text)' }}
          >
            {quality}
          </span>
        )}

        {/* Lang badges — bottom */}
        {(lang || episode_current) && (
          <div className="absolute bottom-2 left-2 flex gap-1 flex-wrap">
            {lang && (
              <span
                className="font-medium uppercase leading-none"
                style={{ fontSize: '10px', padding: '3px 6px', borderRadius: '4px', background: 'rgba(40,43,58,0.9)', color: 'rgba(255,255,255,0.85)', border: '1px solid rgba(255,255,255,0.15)' }}
              >
                {lang}
              </span>
            )}
            {episode_current && (
              <span
                className="font-medium leading-none"
                style={{ fontSize: '10px', padding: '3px 6px', borderRadius: '4px', background: 'rgba(40,43,58,0.9)', color: 'rgba(255,255,255,0.85)', border: '1px solid rgba(255,255,255,0.15)' }}
              >
                {episode_current}
              </span>
            )}
          </div>
        )}
      </div>

      {/* Bottom info: rank (left) + text (right) */}
      <div className="flex items-start gap-2 pt-3">
        {/* Rank number */}
        <span
          className="flex-shrink-0 font-black leading-none"
          style={{ fontSize: '40px', color: 'var(--primary)', lineHeight: '1', marginTop: '-4px', minWidth: '28px', textAlign: 'right' }}
        >
          {rank}
        </span>

        {/* Text info */}
        <div className="flex flex-col gap-0.5 min-w-0">
          <p className="text-sm font-semibold leading-snug line-clamp-2 text-white">{name}</p>
          {origin_name && (
            <p className="text-xs truncate" style={{ color: 'var(--text-muted)' }}>{origin_name}</p>
          )}
          {/* Meta row */}
          <div className="flex items-center gap-1 flex-wrap mt-0.5">
            {year && (
              <span className="text-xs" style={{ color: 'var(--text-muted)' }}>{year}</span>
            )}
            {time && (
              <>
                <span style={{ color: 'var(--bg-4)', fontSize: '10px' }}>•</span>
                <span className="text-xs" style={{ color: 'var(--text-muted)' }}>{time}</span>
              </>
            )}
          </div>
        </div>
      </div>
    </Link>
  )
}
