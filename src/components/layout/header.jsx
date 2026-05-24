import { useState, useEffect, useRef } from 'react'
import { Link, NavLink, useNavigate, useLocation } from 'react-router-dom'
import { MOVIE_TYPES } from '../../utils/constants.js'

const NAV_LINKS = [
  { to: '/', label: 'Trang Chủ', exactPath: true, typeParam: null },
  { to: `/browse?type=${MOVIE_TYPES.SERIES}`, label: 'Phim Bộ', exactPath: false, typeParam: MOVIE_TYPES.SERIES },
  { to: `/browse?type=${MOVIE_TYPES.MOVIE}`, label: 'Phim Lẻ', exactPath: false, typeParam: MOVIE_TYPES.MOVIE },
  { to: `/browse?type=${MOVIE_TYPES.ANIME}`, label: 'Hoạt Hình', exactPath: false, typeParam: MOVIE_TYPES.ANIME },
  { to: `/browse?type=${MOVIE_TYPES.TV}`, label: 'TV Shows', exactPath: false, typeParam: MOVIE_TYPES.TV },
]

function useNavActive() {
  const { pathname, search } = useLocation()
  const params = new URLSearchParams(search)
  const currentType = params.get('type') || ''
  return { pathname, currentType }
}

function isNavActive(link, pathname, currentType) {
  if (link.exactPath) return pathname === link.to
  if (link.typeParam) return pathname === '/browse' && currentType === link.typeParam
  return false
}

export default function Header() {
  const [searchOpen, setSearchOpen] = useState(false)
  const [searchValue, setSearchValue] = useState('')
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const searchInputRef = useRef(null)
  const navigate = useNavigate()
  const { pathname } = useLocation()
  const { pathname: navPath, currentType } = useNavActive()

  useEffect(() => { setMenuOpen(false) }, [pathname])

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    if (searchOpen) searchInputRef.current?.focus()
  }, [searchOpen])

  useEffect(() => {
    if (!menuOpen) return
    function onOutside(e) {
      if (!e.target.closest('[data-mobile-menu]')) setMenuOpen(false)
    }
    document.addEventListener('mousedown', onOutside)
    return () => document.removeEventListener('mousedown', onOutside)
  }, [menuOpen])

  function handleSearchSubmit(e) {
    e.preventDefault()
    const q = searchValue.trim()
    if (!q) return
    navigate(`/tim-kiem?q=${encodeURIComponent(q)}`)
    setSearchOpen(false)
    setSearchValue('')
  }

  function handleSearchKeyDown(e) {
    if (e.key === 'Escape') { setSearchOpen(false); setSearchValue('') }
  }

  return (
    <header
      className="fixed top-0 left-0 right-0 z-50 transition-all duration-300"
      style={{
        background: scrolled
          ? 'rgba(0,0,0,0.95)'
          : 'linear-gradient(to bottom, rgba(0,0,0,0.8) 0%, transparent 100%)',
        backdropFilter: scrolled ? 'blur(8px)' : 'none',
        borderBottom: scrolled ? '1px solid rgba(255,255,255,0.08)' : 'none',
      }}
    >
      <div className="px-8 h-16 flex items-center gap-8">
        {/* Logo */}
        <Link
          to="/"
          className="flex-shrink-0 text-2xl font-black uppercase"
          style={{ color: '#e50914', letterSpacing: '-1px' }}
        >
          VibePHim
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-1 flex-1">
          {NAV_LINKS.map((link) => {
            const active = isNavActive(link, navPath, currentType)
            return (
              <Link
                key={link.to}
                to={link.to}
                className="px-3 py-1.5 rounded-sm text-sm transition-colors duration-200 whitespace-nowrap"
                style={{ color: active ? '#ffffff' : '#b3b3b3', fontWeight: active ? '700' : '500' }}
                onMouseEnter={(e) => { if (!active) e.currentTarget.style.color = '#ffffff' }}
                onMouseLeave={(e) => { if (!active) e.currentTarget.style.color = '#b3b3b3' }}
              >
                {link.label}
              </Link>
            )
          })}
        </nav>

        {/* Right actions */}
        <div className="flex items-center gap-1 ml-auto flex-shrink-0">
          {/* Search */}
          {searchOpen ? (
            <form onSubmit={handleSearchSubmit} className="flex items-center">
              <input
                ref={searchInputRef}
                type="search"
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
                onKeyDown={handleSearchKeyDown}
                placeholder="Tìm phim, diễn viên..."
                aria-label="Tìm kiếm phim"
                className="w-44 md:w-56 h-9 px-3 text-sm text-white bg-black border border-white/30 rounded-sm outline-none focus:border-white/60 transition-colors"
              />
              <button
                type="button"
                onClick={() => { setSearchOpen(false); setSearchValue('') }}
                aria-label="Đóng tìm kiếm"
                className="ml-2 w-8 h-8 flex items-center justify-center text-[#b3b3b3] hover:text-white transition-colors"
              >✕</button>
            </form>
          ) : (
            <button
              onClick={() => setSearchOpen(true)}
              aria-label="Tìm kiếm"
              className="w-8 h-8 flex items-center justify-center text-[#b3b3b3] hover:text-white transition-colors rounded-sm"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
            </button>
          )}

          {/* Favorites */}
          <Link
            to="/yeu-thich"
            aria-label="Phim yêu thích"
            className="w-8 h-8 hidden md:flex items-center justify-center text-[#b3b3b3] hover:text-white transition-colors rounded-sm"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
            </svg>
          </Link>

          {/* History */}
          <Link
            to="/lich-su"
            aria-label="Lịch sử xem"
            className="w-8 h-8 hidden md:flex items-center justify-center text-[#b3b3b3] hover:text-white transition-colors rounded-sm"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10" />
              <polyline points="12 6 12 12 16 14" />
            </svg>
          </Link>

          {/* Hamburger (mobile only) */}
          <button
            data-mobile-menu
            onClick={() => setMenuOpen((v) => !v)}
            aria-label={menuOpen ? 'Đóng menu' : 'Mở menu'}
            className="md:hidden w-8 h-8 flex items-center justify-center text-[#b3b3b3] hover:text-white transition-colors"
          >
            {menuOpen
              ? <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
              : <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><line x1="3" y1="6" x2="21" y2="6" /><line x1="3" y1="12" x2="21" y2="12" /><line x1="3" y1="18" x2="21" y2="18" /></svg>
            }
          </button>
        </div>
      </div>

      {/* Mobile dropdown */}
      {menuOpen && (
        <nav
          data-mobile-menu
          className="md:hidden border-t border-white/10 px-8 py-4 flex flex-col gap-4"
          style={{ background: 'rgba(0,0,0,0.97)' }}
        >
          {NAV_LINKS.map((link) => {
            const active = isNavActive(link, navPath, currentType)
            return (
              <Link
                key={link.to}
                to={link.to}
                className="text-sm py-1 transition-colors"
                style={{ color: active ? '#ffffff' : '#b3b3b3', fontWeight: active ? '700' : '500' }}
              >
                {link.label}
              </Link>
            )
          })}
          <div className="flex gap-4 pt-2 border-t border-white/10">
            <Link to="/yeu-thich" className="text-sm text-[#b3b3b3] hover:text-white transition-colors">♡ Yêu Thích</Link>
            <Link to="/lich-su" className="text-sm text-[#b3b3b3] hover:text-white transition-colors">⏱ Lịch Sử</Link>
          </div>
        </nav>
      )}
    </header>
  )
}
