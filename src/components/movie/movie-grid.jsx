import { Link } from 'react-router-dom'
import { getImageUrl } from '../../services/ophim-api.js'
import { SkeletonGridCard } from '../ui/skeleton.jsx'

function GridCard({ movie }) {
  const { name, slug, thumb_url, year, quality, lang, episode_current } = movie
  return (
    <Link
      to={`/phim/${slug}`}
      className="group relative block overflow-hidden rounded-sm cursor-pointer"
      style={{ background: '#232323', transition: 'transform 400ms ease, box-shadow 400ms ease' }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'scale(1.03)'
        e.currentTarget.style.boxShadow = '0 8px 32px rgba(0,0,0,0.7)'
        e.currentTarget.style.zIndex = '5'
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'scale(1)'
        e.currentTarget.style.boxShadow = 'none'
        e.currentTarget.style.zIndex = ''
      }}
    >
      {/* Poster */}
      <div className="relative aspect-[2/3] overflow-hidden">
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
        </div>

        {/* Quality badge */}
        {quality && (
          <span
            className="absolute top-1.5 right-1.5 font-mono text-[9px] font-bold px-1.5 py-0.5 rounded-sm uppercase leading-none"
            style={{ background: '#e50914', color: '#fff' }}
          >
            {quality}
          </span>
        )}

        {/* Episode / lang badge */}
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
      <div className="px-2 pt-2 pb-3" style={{ background: '#232323' }}>
        <p className="text-[13px] font-semibold truncate text-white">{name}</p>
        {year && <p className="text-[11px] mt-0.5 font-mono" style={{ color: '#737373' }}>{year}</p>}
      </div>
    </Link>
  )
}

export default function MovieGrid({ movies = [], loading }) {
  if (loading) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
        {Array.from({ length: 20 }).map((_, i) => <SkeletonGridCard key={i} />)}
      </div>
    )
  }

  if (!movies.length) {
    return (
      <div className="py-16 text-center text-sm" style={{ color: '#737373' }}>
        Không tìm thấy phim nào.
      </div>
    )
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
      {movies.map((m) => <GridCard key={m._id || m.slug} movie={m} />)}
    </div>
  )
}
