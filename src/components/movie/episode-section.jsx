import { useState, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { useWatchHistory } from '../../contexts/watch-history-context.jsx'

function parseTotalEpisodes(raw) {
  if (!raw) return 0
  const n = parseInt(raw)
  return isNaN(n) ? 0 : n
}

// Add "Tập" prefix when ep name is a bare number
function formatEpLabel(name) {
  return /^\d+$/.test(name?.trim()) ? `Tập ${name}` : name
}

const PlayIcon = () => (
  <svg width="8" height="8" viewBox="0 0 24 24" fill="currentColor" style={{ flexShrink: 0 }}>
    <polygon points="5,3 19,12 5,21" />
  </svg>
)

export default function EpisodeSection({ episodes = [], movieSlug, currentEpSlug, episodeTotal }) {
  const { history } = useWatchHistory()
  const [activeServer, setActiveServer] = useState(0)
  const activeRef = useRef(null)

  useEffect(() => {
    activeRef.current?.scrollIntoView({ block: 'nearest', inline: 'center', behavior: 'smooth' })
  }, [currentEpSlug, activeServer])

  if (!episodes.length) return null

  const server = episodes[activeServer]
  const epList = server?.server_data || []

  // Generate upcoming placeholder slots (episodes not yet released)
  const totalNum = parseTotalEpisodes(episodeTotal)
  const upcomingCount = totalNum > epList.length ? totalNum - epList.length : 0
  const upcomingSlots = Array.from({ length: upcomingCount }, (_, i) => ({
    num: epList.length + i + 1,
  }))

  return (
    <div className="mt-8">
      <h2 className="text-xl font-bold text-white mb-5">Danh Sách Tập</h2>

      {/* Server tabs */}
      {episodes.length > 1 && (
        <div className="flex gap-0 mb-5" style={{ borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
          {episodes.map((s, i) => (
            <button
              key={i}
              onClick={() => setActiveServer(i)}
              className="px-4 py-3 text-sm font-semibold transition-all duration-200"
              style={{
                border: 'none',
                background: 'transparent',
                borderBottom: i === activeServer ? '2px solid var(--primary)' : '2px solid transparent',
                marginBottom: '-1px',
                color: i === activeServer ? '#ffffff' : '#737373',
              }}
              onMouseEnter={(e) => { if (i !== activeServer) e.currentTarget.style.color = '#b3b3b3' }}
              onMouseLeave={(e) => { if (i !== activeServer) e.currentTarget.style.color = '#737373' }}
            >
              {s.server_name || `Server ${i + 1}`}
            </button>
          ))}
        </div>
      )}

      {/* Episode grid — pt-3 gives room for top badges */}
      {epList.length > 0 ? (
        <div className="flex flex-wrap gap-x-2 gap-y-5 pt-3">
          {epList.map((ep) => {
            const isCurrent = ep.slug === currentEpSlug
            const watched = history.find((h) => h.slug === movieSlug && h.episode === ep.slug)
            const pct = watched?.duration && watched?.progress
              ? Math.min(100, Math.round((watched.progress / watched.duration) * 100))
              : watched ? 1 : 0
            const done = pct >= 95
            return (
              <Link
                key={ep.slug}
                ref={isCurrent ? activeRef : null}
                to={`/xem/${movieSlug}/${ep.slug}`}
                className="relative inline-flex items-center gap-1.5 font-mono text-xs font-medium transition-all duration-200"
                style={{
                  minWidth: '72px',
                  padding: '8px 12px',
                  borderRadius: '2px',
                  border: isCurrent
                    ? '1px solid var(--primary)'
                    : done
                      ? '1px solid rgba(70,211,105,0.4)'
                      : watched
                        ? '1px solid rgba(255,216,117,0.3)'
                        : '1px solid rgba(255,255,255,0.15)',
                  background: isCurrent ? 'var(--primary)' : 'var(--bg-3)',
                  color: isCurrent ? 'var(--primary-btn-text)' : 'var(--text-base)',
                  fontWeight: isCurrent ? '700' : '400',
                }}
                onMouseEnter={(e) => {
                  if (!isCurrent) {
                    e.currentTarget.style.background = 'var(--bg-4)'
                    e.currentTarget.style.color = '#ffffff'
                    e.currentTarget.style.borderColor = 'rgba(255,255,255,0.4)'
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isCurrent) {
                    e.currentTarget.style.background = 'var(--bg-3)'
                    e.currentTarget.style.color = 'var(--text-base)'
                    e.currentTarget.style.borderColor = done
                      ? 'rgba(70,211,105,0.4)'
                      : watched
                        ? 'rgba(255,216,117,0.3)'
                        : 'rgba(255,255,255,0.15)'
                  }
                }}
              >
                <PlayIcon />
                {formatEpLabel(ep.name)}
                {watched && !isCurrent && (
                  <span
                    className="absolute -top-2.5 left-1/2 -translate-x-1/2 text-[8px] font-bold uppercase tracking-wide px-1 rounded-sm whitespace-nowrap"
                    style={done
                      ? { background: 'rgba(70,211,105,0.2)', color: '#46d369' }
                      : { background: 'rgba(255,216,117,0.15)', color: 'var(--primary)' }
                    }
                  >
                    {done ? 'Đã xem' : `${pct}%`}
                  </span>
                )}
              </Link>
            )
          })}
          {/* Upcoming placeholder buttons */}
          {upcomingSlots.map(({ num }) => (
            <span
              key={`upcoming-${num}`}
              className="relative inline-flex items-center gap-1.5 font-mono text-xs font-medium"
              title="Chưa phát sóng"
              style={{
                minWidth: '72px',
                padding: '8px 12px',
                borderRadius: '2px',
                border: '1px solid rgba(255,255,255,0.07)',
                background: 'var(--bg-2)',
                color: 'rgba(255,255,255,0.25)',
                cursor: 'not-allowed',
                userSelect: 'none',
              }}
            >
              <PlayIcon />
              Tập {num}
              <span
                className="absolute -top-2.5 left-1/2 -translate-x-1/2 text-[8px] font-bold uppercase tracking-wide px-1 rounded-sm whitespace-nowrap"
                style={{ background: 'rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.35)' }}
              >
                Sắp chiếu
              </span>
            </span>
          ))}
        </div>
      ) : (
        <p className="text-sm" style={{ color: '#737373' }}>Chưa có tập phim.</p>
      )}
    </div>
  )
}
