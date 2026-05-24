import { Link } from 'react-router-dom'
import { useWatchHistory } from '../contexts/watch-history-context.jsx'
import { getImageUrl } from '../services/ophim-api.js'

function timeAgo(ts) {
  const diff = Date.now() - ts
  const m = Math.floor(diff / 60000)
  if (m < 60) return `${m || 1} phút trước`
  const h = Math.floor(m / 60)
  if (h < 24) return `${h} giờ trước`
  const d = Math.floor(h / 24)
  if (d < 7) return d === 1 ? 'Hôm qua' : `${d} ngày trước`
  return new Date(ts).toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' })
}

function formatTime(sec) {
  if (!sec) return '0:00'
  const h = Math.floor(sec / 3600)
  const m = Math.floor((sec % 3600) / 60)
  const s = Math.floor(sec % 60)
  if (h > 0) return `${h}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`
  return `${m}:${String(s).padStart(2, '0')}`
}

function HistoryItem({ entry }) {
  const { slug, name, thumb_url, episode, episodeName, progress, duration, watchedAt } = entry
  const pct = duration && progress ? Math.min(100, Math.round((progress / duration) * 100)) : 0
  const done = pct >= 95

  return (
    <div
      className="flex gap-5 transition-colors duration-200"
      style={{
        padding: '20px',
        background: 'var(--bg-color)',
        borderRadius: '4px',
        border: '1px solid rgba(255,255,255,0.1)',
      }}
      onMouseEnter={(e) => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.2)' }}
      onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)' }}
    >
      {/* Thumbnail */}
      <Link
        to={`/xem/${slug}/${episode}`}
        className="flex-shrink-0 overflow-hidden rounded-sm"
        style={{ width: '128px', aspectRatio: '16/9', background: 'var(--bg-2)' }}
      >
        <img
          src={getImageUrl(thumb_url)}
          alt={name}
          loading="lazy"
          className="w-full h-full object-cover"
          style={{ display: 'block' }}
          onError={(e) => { e.target.style.display = 'none' }}
        />
      </Link>

      {/* Info */}
      <div className="flex-1 min-w-0 flex flex-col gap-2">
        <Link
          to={`/phim/${slug}`}
          className="text-base font-bold text-white hover:underline line-clamp-1"
        >
          {name}
        </Link>
        {episodeName && (
          <p className="text-sm" style={{ color: '#b3b3b3' }}>{episodeName}</p>
        )}

        {/* Progress bar */}
        <div className="rounded-sm overflow-hidden" style={{ height: '3px', background: 'var(--bg-3)' }}>
          <div
            className="h-full rounded-sm"
            style={{
              width: `${pct}%`,
              background: done ? '#46d369' : 'var(--primary)',
            }}
          />
        </div>

        {/* Meta */}
        <div className="flex gap-5 font-mono text-[11px]" style={{ color: '#737373' }}>
          {progress != null && (
            <span>{formatTime(progress)}{duration ? ` / ${formatTime(duration)}` : ''}</span>
          )}
          <span>{timeAgo(watchedAt)}</span>
        </div>
      </div>

      {/* Continue button */}
      <div className="flex items-end flex-shrink-0">
        <Link
          to={`/xem/${slug}/${episode}`}
          className="text-sm font-bold whitespace-nowrap transition-all duration-200"
          style={done
            ? {
                padding: '8px 16px',
                border: '1px solid rgba(255,255,255,0.2)',
                borderRadius: '4px',
                color: '#b3b3b3',
                background: 'transparent',
              }
            : {
                padding: '8px 16px',
                border: '1px solid var(--primary)',
                borderRadius: '4px',
                color: 'var(--primary)',
                background: 'rgba(255,216,117,0.1)',
              }
          }
          onMouseEnter={(e) => {
            if (done) {
              e.currentTarget.style.background = 'var(--bg-3)'
              e.currentTarget.style.color = '#fff'
            } else {
              e.currentTarget.style.background = 'var(--primary)'
              e.currentTarget.style.color = '#fff'
            }
          }}
          onMouseLeave={(e) => {
            if (done) {
              e.currentTarget.style.background = 'transparent'
              e.currentTarget.style.color = '#b3b3b3'
            } else {
              e.currentTarget.style.background = 'rgba(229,9,20,0.12)'
              e.currentTarget.style.color = 'var(--primary)'
            }
          }}
        >
          ▶ {done ? 'Xem lại' : 'Tiếp tục'}
        </Link>
      </div>
    </div>
  )
}

export default function HistoryPage() {
  const { history, clearHistory } = useWatchHistory()

  return (
    <div className="min-h-screen text-white" style={{ background: 'var(--bg-color)' }}>
      {/* Page title bar */}
      <div
        className="flex items-center justify-between px-8 pt-24 pb-5"
        style={{ borderBottom: '1px solid rgba(255,255,255,0.1)' }}
      >
        <div>
          <h1 className="text-2xl font-bold">⏱ Lịch Sử Xem</h1>
          <p className="text-sm mt-2 font-mono" style={{ color: '#b3b3b3' }}>
            {history.length} phim đã xem
          </p>
        </div>
        {history.length > 0 && (
          <button
            onClick={clearHistory}
            className="text-sm transition-all duration-200"
            style={{
              padding: '8px 16px',
              border: '1px solid rgba(255,216,117,0.4)',
              borderRadius: '2px',
              background: 'transparent',
              color: 'var(--primary)',
            }}
            onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(229,9,20,0.12)' }}
            onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent' }}
          >
            Xóa Lịch Sử
          </button>
        )}
      </div>

      {/* List */}
      {history.length === 0 ? (
        <div className="py-20 text-center px-8">
          <p className="text-sm mb-4" style={{ color: '#737373' }}>Chưa xem phim nào.</p>
          <Link to="/" className="text-sm font-medium" style={{ color: 'var(--primary)' }}>
            Xem phim ngay →
          </Link>
        </div>
      ) : (
        <div className="px-8 py-5 flex flex-col gap-3 pb-16">
          {history.map((entry) => (
            <HistoryItem key={`${entry.slug}-${entry.episode}`} entry={entry} />
          ))}
        </div>
      )}
    </div>
  )
}
