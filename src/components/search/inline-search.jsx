import { useState, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useRealtimeSearch } from '../../hooks/use-realtime-search.js'
import { getImageUrl } from '../../services/ophim-api.js'

const AVATAR_COLORS = ['#e74c3c','#e67e22','#2ecc71','#3498db','#9b59b6','#e91e63','#1abc9c','#f39c12']

function avatarColor(name) {
  let h = 0
  for (let i = 0; i < name.length; i++) h = name.charCodeAt(i) + ((h << 5) - h)
  return AVATAR_COLORS[Math.abs(h) % AVATAR_COLORS.length]
}

function SearchIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
    </svg>
  )
}

function MovieRow({ movie, onClick }) {
  const poster = getImageUrl(movie.thumb_url)
  const meta = [movie.episode_current || movie.time, movie.year].filter(Boolean).join(' • ')
  return (
    <button
      onClick={() => onClick(movie.slug)}
      className="w-full flex items-start gap-3 px-4 py-2.5 text-left transition-colors"
      onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(255,255,255,0.07)' }}
      onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent' }}
    >
      <img src={poster} alt={movie.name} className="w-10 h-14 object-cover rounded flex-shrink-0 bg-gray-700" />
      <div className="flex-1 min-w-0 pt-0.5">
        <p className="text-sm font-semibold text-white truncate leading-tight">{movie.name}</p>
        <p className="text-xs truncate mt-0.5" style={{ color: 'rgba(255,255,255,0.45)' }}>{movie.origin_name}</p>
        {meta && <p className="text-xs mt-1" style={{ color: 'rgba(255,255,255,0.35)' }}>{meta}</p>}
      </div>
    </button>
  )
}

function ActorRow({ name, onClick }) {
  return (
    <button
      onClick={() => onClick(name)}
      className="w-full flex items-center gap-3 px-4 py-2.5 text-left transition-colors"
      onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(255,255,255,0.07)' }}
      onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent' }}
    >
      <div
        className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 text-xs font-bold text-white"
        style={{ background: avatarColor(name) }}
      >
        {name.charAt(0).toUpperCase()}
      </div>
      <span className="text-sm text-white truncate">{name}</span>
    </button>
  )
}

function SectionLabel({ children }) {
  return (
    <p className="px-4 pt-3 pb-1.5 text-xs font-semibold uppercase tracking-wider" style={{ color: 'rgba(255,255,255,0.35)' }}>
      {children}
    </p>
  )
}

export default function InlineSearch({ className = '' }) {
  const [query, setQuery] = useState('')
  const [open, setOpen] = useState(false)
  const inputRef = useRef(null)
  const containerRef = useRef(null)
  const navigate = useNavigate()

  const activeQuery = open && query.trim().length >= 2 ? query : ''
  const { movies, actors, loading } = useRealtimeSearch(activeQuery)
  const hasResults = movies.length > 0 || actors.length > 0
  const showDropdown = open && query.trim().length >= 2 && (loading || hasResults)

  useEffect(() => {
    if (!open) return
    function onOutside(e) {
      if (!containerRef.current?.contains(e.target)) setOpen(false)
    }
    document.addEventListener('mousedown', onOutside)
    return () => document.removeEventListener('mousedown', onOutside)
  }, [open])

  function handleKeyDown(e) {
    if (e.key === 'Escape') { setOpen(false); inputRef.current?.blur() }
    if (e.key === 'Enter') {
      const q = query.trim()
      if (!q) return
      navigate(`/tim-kiem?q=${encodeURIComponent(q)}`)
      setOpen(false)
      setQuery('')
    }
  }

  function handleChange(e) {
    setQuery(e.target.value)
    setOpen(true)
  }

  function handleClear() {
    setQuery('')
    setOpen(false)
    inputRef.current?.focus()
  }

  function handleMovieClick(slug) {
    navigate(`/phim/${slug}`)
    setOpen(false)
    setQuery('')
  }

  function handleActorClick(name) {
    navigate(`/tim-kiem?q=${encodeURIComponent(name)}`)
    setOpen(false)
    setQuery('')
  }

  return (
    <div ref={containerRef} className={`relative ${className}`}>
      {/* Input */}
      <div
        className="flex items-center h-9 rounded-lg px-3 gap-2 transition-colors"
        style={{
          background: 'rgba(255,255,255,0.08)',
          border: `1px solid ${open ? 'rgba(255,255,255,0.3)' : 'rgba(255,255,255,0.12)'}`,
        }}
      >
        <span style={{ color: 'rgba(255,255,255,0.4)', flexShrink: 0 }}>
          <SearchIcon />
        </span>
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={handleChange}
          onFocus={() => { if (query.trim().length >= 2) setOpen(true) }}
          onKeyDown={handleKeyDown}
          placeholder="Tìm kiếm phim, diễn viên..."
          className="flex-1 bg-transparent outline-none text-sm text-white min-w-0"
          style={{ caretColor: 'var(--primary)' }}
        />
        {query && (
          <button
            onClick={handleClear}
            className="flex-shrink-0 w-4 h-4 rounded-full flex items-center justify-center"
            style={{ background: 'rgba(255,255,255,0.3)', color: 'white' }}
          >
            <svg width="8" height="8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round">
              <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        )}
      </div>

      {/* Dropdown */}
      {showDropdown && (
        <div
          className="absolute top-full left-0 right-0 mt-1.5 rounded-xl overflow-hidden z-50 shadow-2xl"
          style={{ background: '#1c1f2e', border: '1px solid rgba(255,255,255,0.1)', minWidth: '320px' }}
        >
          {loading && !hasResults && (
            <p className="px-4 py-5 text-sm text-center" style={{ color: 'rgba(255,255,255,0.4)' }}>Đang tìm kiếm...</p>
          )}
          {movies.length > 0 && (
            <div>
              <SectionLabel>Danh sách phim</SectionLabel>
              {movies.map((m) => <MovieRow key={m.slug} movie={m} onClick={handleMovieClick} />)}
            </div>
          )}
          {actors.length > 0 && (
            <div className={movies.length > 0 ? 'border-t' : ''} style={{ borderColor: 'rgba(255,255,255,0.07)' }}>
              <SectionLabel>Danh sách diễn viên</SectionLabel>
              {actors.map((a) => <ActorRow key={a} name={a} onClick={handleActorClick} />)}
            </div>
          )}
          <div className="h-2" />
        </div>
      )}
    </div>
  )
}
