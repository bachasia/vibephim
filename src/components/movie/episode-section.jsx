import { useState, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'

export default function EpisodeSection({ episodes = [], movieSlug, currentEpSlug }) {
  const [activeServer, setActiveServer] = useState(0)
  const activeRef = useRef(null)

  useEffect(() => {
    activeRef.current?.scrollIntoView({ block: 'nearest', inline: 'center', behavior: 'smooth' })
  }, [currentEpSlug, activeServer])

  if (!episodes.length) return null

  const server = episodes[activeServer]
  const epList = server?.server_data || []

  return (
    <div className="mt-8">
      <h2 className="text-xl font-bold text-white mb-5">Danh Sách Tập</h2>

      {/* Server tabs — border-bottom style */}
      {episodes.length > 1 && (
        <div
          className="flex gap-0 mb-5"
          style={{ borderBottom: '1px solid rgba(255,255,255,0.1)' }}
        >
          {episodes.map((s, i) => (
            <button
              key={i}
              onClick={() => setActiveServer(i)}
              className="px-4 py-3 text-sm font-semibold transition-all duration-200"
              style={{
                border: 'none',
                background: 'transparent',
                borderBottom: i === activeServer ? '2px solid #e50914' : '2px solid transparent',
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

      {/* Episode buttons */}
      {epList.length > 0 ? (
        <div className="flex flex-wrap gap-2">
          {epList.map((ep) => {
            const isCurrent = ep.slug === currentEpSlug
            return (
              <Link
                key={ep.slug}
                ref={isCurrent ? activeRef : null}
                to={`/xem/${movieSlug}/${ep.slug}`}
                className="font-mono text-xs font-medium text-center transition-all duration-200"
                style={{
                  minWidth: '64px',
                  padding: '8px 12px',
                  borderRadius: '2px',
                  border: isCurrent ? '1px solid #e50914' : '1px solid rgba(255,255,255,0.15)',
                  background: isCurrent ? '#e50914' : '#2d2d2d',
                  color: isCurrent ? '#ffffff' : '#b3b3b3',
                  fontWeight: isCurrent ? '700' : '400',
                }}
                onMouseEnter={(e) => {
                  if (!isCurrent) {
                    e.currentTarget.style.background = '#232323'
                    e.currentTarget.style.color = '#ffffff'
                    e.currentTarget.style.borderColor = 'rgba(255,255,255,0.4)'
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isCurrent) {
                    e.currentTarget.style.background = '#2d2d2d'
                    e.currentTarget.style.color = '#b3b3b3'
                    e.currentTarget.style.borderColor = 'rgba(255,255,255,0.15)'
                  }
                }}
              >
                {ep.name}
              </Link>
            )
          })}
        </div>
      ) : (
        <p className="text-sm" style={{ color: '#737373' }}>Chưa có tập phim.</p>
      )}
    </div>
  )
}
