import { Link } from 'react-router-dom'
import { useMovies } from '../../hooks/use-movies.js'
import { getImageUrl } from '../../services/ophim-api.js'

function ActorAvatar({ name }) {
  const initials = name.split(' ').slice(-2).map(w => w[0]?.toUpperCase() || '').join('')
  const hue = name.split('').reduce((acc, c) => acc + c.charCodeAt(0), 0) % 360
  return (
    <div className="flex flex-col items-center gap-1.5 text-center">
      <div
        className="rounded-full flex items-center justify-center text-white font-bold text-sm shrink-0"
        style={{
          width: '52px', height: '52px',
          background: `hsl(${hue},40%,28%)`,
          border: '2px solid rgba(255,255,255,0.08)',
        }}
      >
        {initials || '?'}
      </div>
      <span className="text-[11px] leading-tight line-clamp-2" style={{ color: 'var(--text-base)', maxWidth: '60px' }}>
        {name}
      </span>
    </div>
  )
}

function RecommendCard({ movie }) {
  const { name, thumb_url, year, episode_current, slug } = movie
  return (
    <Link
      to={`/phim/${slug}`}
      className="flex gap-2.5 group"
      style={{ padding: '8px 0', borderBottom: '1px solid var(--border-color)' }}
    >
      <div className="shrink-0 rounded-sm overflow-hidden" style={{ width: '60px', aspectRatio: '2/3', background: 'var(--bg-3)' }}>
        <img
          src={getImageUrl(thumb_url)}
          alt={name}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
          onError={e => { e.target.style.display = 'none' }}
        />
      </div>
      <div className="flex-1 min-w-0 py-0.5">
        <p className="text-sm font-medium leading-snug line-clamp-2 transition-colors group-hover:text-white" style={{ color: 'var(--text-base)' }}>
          {name}
        </p>
        <div className="flex items-center gap-1.5 mt-1.5 flex-wrap">
          {year && (
            <span className="text-[11px]" style={{ color: 'var(--text-muted)' }}>{year}</span>
          )}
          {episode_current && (
            <span
              className="text-[11px] px-1.5 py-0.5 rounded-sm"
              style={{ background: 'var(--bg-3)', color: 'var(--text-muted)' }}
            >
              {episode_current}
            </span>
          )}
        </div>
      </div>
    </Link>
  )
}

export default function WatchSidebar({ movie }) {
  const { movies } = useMovies(1)
  const actors = movie?.actor?.filter(a => a && a !== 'Đang cập nhật') || []
  const recommended = movies.slice(0, 10)

  return (
    <div className="space-y-6">
      {/* Cast */}
      {actors.length > 0 && (
        <section>
          <h3 className="text-sm font-bold text-white mb-3 pb-2" style={{ borderBottom: '2px solid var(--primary)' }}>
            Diễn viên
          </h3>
          <div className="grid grid-cols-3 gap-x-2 gap-y-4">
            {actors.slice(0, 12).map((name) => (
              <ActorAvatar key={name} name={name} />
            ))}
          </div>
        </section>
      )}

      {/* Recommendations */}
      {recommended.length > 0 && (
        <section>
          <h3 className="text-sm font-bold text-white mb-1 pb-2" style={{ borderBottom: '2px solid var(--primary)' }}>
            Đề xuất cho bạn
          </h3>
          <div>
            {recommended.map((m) => (
              <RecommendCard key={m.slug} movie={m} />
            ))}
          </div>
        </section>
      )}
    </div>
  )
}
