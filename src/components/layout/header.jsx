import { useState, useEffect, useRef } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { MOVIE_TYPES } from '../../utils/constants.js'
import VibephimLogo from '../ui/vibephim-logo.jsx'
import NavDropdown from './nav-dropdown.jsx'
import InlineSearch from '../search/inline-search.jsx'
import { useAuth } from '../../contexts/auth-context.jsx'
import AuthModal from '../auth/auth-modal.jsx'

const CATEGORIES = [
  { label: 'Hành Động', to: '/the-loai/hanh-dong' },
  { label: 'Tình Cảm', to: '/the-loai/tinh-cam' },
  { label: 'Hài Hước', to: '/the-loai/hai-huoc' },
  { label: 'Cổ Trang', to: '/the-loai/co-trang' },
  { label: 'Tâm Lý', to: '/the-loai/tam-ly' },
  { label: 'Hình Sự', to: '/the-loai/hinh-su' },
  { label: 'Kinh Dị', to: '/the-loai/kinh-di' },
  { label: 'Viễn Tưởng', to: '/the-loai/vien-tuong' },
  { label: 'Phiêu Lưu', to: '/the-loai/phieu-luu' },
  { label: 'Thần Thoại', to: '/the-loai/than-thoai' },
  { label: 'Võ Thuật', to: '/the-loai/vo-thuat' },
  { label: 'Âm Nhạc', to: '/the-loai/am-nhac' },
]

const COUNTRIES = [
  { label: 'Hàn Quốc', to: '/quoc-gia/han-quoc' },
  { label: 'Trung Quốc', to: '/quoc-gia/trung-quoc' },
  { label: 'Âu Mỹ', to: '/quoc-gia/au-my' },
  { label: 'Nhật Bản', to: '/quoc-gia/nhat-ban' },
  { label: 'Thái Lan', to: '/quoc-gia/thai-lan' },
  { label: 'Hồng Kông', to: '/quoc-gia/hong-kong' },
  { label: 'Việt Nam', to: '/quoc-gia/viet-nam' },
  { label: 'Anh', to: '/quoc-gia/anh' },
  { label: 'Pháp', to: '/quoc-gia/phap' },
  { label: 'Đài Loan', to: '/quoc-gia/dai-loan' },
  { label: 'Ấn Độ', to: '/quoc-gia/an-do' },
  { label: 'Khác', to: '/quoc-gia/quoc-gia-khac' },
]

const NAV_LINKS = [
  { to: '/', label: 'Trang Chủ', exact: true },
  { to: `/browse?type=${MOVIE_TYPES.SERIES}`, label: 'Phim Bộ', type: MOVIE_TYPES.SERIES },
  { to: `/browse?type=${MOVIE_TYPES.MOVIE}`, label: 'Phim Lẻ', type: MOVIE_TYPES.MOVIE },
  { to: `/browse?type=${MOVIE_TYPES.ANIME}`, label: 'Hoạt Hình', type: MOVIE_TYPES.ANIME },
  { to: `/browse?type=${MOVIE_TYPES.TV}`, label: 'TV Shows', type: MOVIE_TYPES.TV },
]

function isActive(link, pathname, currentType) {
  if (link.exact) return pathname === '/'
  if (link.type) return pathname === '/browse' && currentType === link.type
  return false
}

export default function Header() {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const [authOpen, setAuthOpen] = useState(false)
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const dropdownRef = useRef(null)
  const { user, signOut } = useAuth()
  const { pathname, search } = useLocation()
  const currentType = new URLSearchParams(search).get('type') || ''

  useEffect(() => { setMenuOpen(false); setAuthOpen(false) }, [pathname])

  useEffect(() => {
    if (!dropdownOpen) return
    function onOutside(e) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) setDropdownOpen(false)
    }
    document.addEventListener('mousedown', onOutside)
    return () => document.removeEventListener('mousedown', onOutside)
  }, [dropdownOpen])

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    if (!menuOpen) return
    function onOutside(e) {
      if (!e.target.closest('[data-mobile-menu]')) setMenuOpen(false)
    }
    document.addEventListener('mousedown', onOutside)
    return () => document.removeEventListener('mousedown', onOutside)
  }, [menuOpen])

  return (
    <header
      className="fixed top-0 left-0 right-0 z-50 transition-all duration-300"
      style={{
        height: '70px',
        background: scrolled ? 'rgba(15,17,26,0.97)' : 'linear-gradient(to bottom, rgba(15,17,26,0.92) 0%, transparent 100%)',
        backdropFilter: scrolled ? 'blur(10px)' : 'none',
        borderBottom: scrolled ? '1px solid var(--border-color)' : 'none',
      }}
    >
      <div className="h-full px-4 md:px-8 flex items-center gap-3 md:gap-4">
        {/* Logo */}
        <Link to="/" className="flex-shrink-0">
          <VibephimLogo iconSize={28} fontSize={18} />
        </Link>

        {/* Center: search + nav — flex-1 so it fills space, auth stays visible */}
        <div className="hidden md:flex items-center gap-3 flex-1 min-w-0">
          <InlineSearch className="flex-none w-52" />
          <nav className="flex items-center gap-0.5 ml-auto flex-shrink-0">
            {NAV_LINKS.map((link) => {
              const active = isActive(link, pathname, currentType)
              return (
                <Link
                  key={link.to}
                  to={link.to}
                  className="px-2 py-1.5 rounded text-sm transition-colors duration-200 whitespace-nowrap"
                  style={{ color: active ? 'var(--primary)' : '#b3b3b3', fontWeight: active ? '600' : '400' }}
                  onMouseEnter={(e) => { if (!active) e.currentTarget.style.color = '#fff' }}
                  onMouseLeave={(e) => { if (!active) e.currentTarget.style.color = '#b3b3b3' }}
                >
                  {link.label}
                </Link>
              )
            })}
            <NavDropdown label="Thể Loại" items={CATEGORIES} columns={3} />
            <NavDropdown label="Quốc Gia" items={COUNTRIES} columns={3} />
          </nav>
        </div>

        {/* Desktop icon actions — flex-shrink-0 so auth button is always visible */}
        <div className="hidden md:flex items-center gap-1 flex-shrink-0">
          <Link to="/yeu-thich" aria-label="Yêu thích"
            className="w-9 h-9 flex items-center justify-center rounded transition-colors"
            style={{ color: 'var(--text-base)' }}
            onMouseEnter={(e) => { e.currentTarget.style.color = 'var(--primary)' }}
            onMouseLeave={(e) => { e.currentTarget.style.color = 'var(--text-base)' }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
            </svg>
          </Link>
          <Link to="/lich-su" aria-label="Lịch sử"
            className="w-9 h-9 flex items-center justify-center rounded transition-colors"
            style={{ color: 'var(--text-base)' }}
            onMouseEnter={(e) => { e.currentTarget.style.color = 'var(--primary)' }}
            onMouseLeave={(e) => { e.currentTarget.style.color = 'var(--text-base)' }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" />
            </svg>
          </Link>

          {/* Auth: login button or user avatar */}
          {user ? (
            <div ref={dropdownRef} className="relative ml-1">
              <button
                onClick={() => setDropdownOpen((v) => !v)}
                className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-opacity"
                style={{ background: 'var(--primary)', color: 'var(--primary-btn-text, #fff)' }}
                aria-label="Tài khoản"
              >
                {(user.email?.[0] ?? '?').toUpperCase()}
              </button>
              {dropdownOpen && (
                <div
                  className="absolute right-0 top-full mt-2 w-44 rounded-xl py-1 shadow-lg z-10"
                  style={{ background: 'var(--bg-2)', border: '1px solid var(--border-color)' }}
                >
                  <p className="text-xs px-3 py-2 truncate" style={{ color: 'var(--text-muted)' }}>{user.email}</p>
                  <div style={{ height: '1px', background: 'var(--border-color)' }} />
                  <button
                    onClick={() => { signOut(); setDropdownOpen(false) }}
                    className="w-full text-left text-sm px-3 py-2 transition-colors"
                    style={{ color: 'var(--text-base)' }}
                    onMouseEnter={(e) => { e.currentTarget.style.color = 'var(--primary)' }}
                    onMouseLeave={(e) => { e.currentTarget.style.color = 'var(--text-base)' }}
                  >
                    Đăng xuất
                  </button>
                </div>
              )}
            </div>
          ) : (
            <button
              onClick={() => setAuthOpen(true)}
              className="ml-1 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors"
              style={{ background: 'var(--primary)', color: 'var(--primary-btn-text, #fff)' }}
            >
              Đăng nhập
            </button>
          )}
        </div>

        {/* Mobile hamburger */}
        <button
          data-mobile-menu
          onClick={() => setMenuOpen((v) => !v)}
          aria-label={menuOpen ? 'Đóng menu' : 'Mở menu'}
          className="md:hidden ml-auto w-9 h-9 flex items-center justify-center transition-colors flex-shrink-0"
          style={{ color: 'var(--text-base)' }}
        >
          {menuOpen
            ? <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
            : <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><line x1="3" y1="6" x2="21" y2="6" /><line x1="3" y1="12" x2="21" y2="12" /><line x1="3" y1="18" x2="21" y2="18" /></svg>
          }
        </button>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <nav
          data-mobile-menu
          className="md:hidden px-6 py-4 flex flex-col gap-3"
          style={{ background: 'rgba(15,17,26,0.99)', borderTop: '1px solid var(--border-color)' }}
        >
          {NAV_LINKS.map((link) => {
            const active = isActive(link, pathname, currentType)
            return (
              <Link key={link.to} to={link.to}
                className="text-sm py-1 transition-colors"
                style={{ color: active ? 'var(--primary)' : '#b3b3b3', fontWeight: active ? '600' : '400' }}
              >
                {link.label}
              </Link>
            )
          })}
          <div className="pt-2 border-t" style={{ borderColor: 'var(--border-color)' }}>
            <p className="text-xs mb-2 uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>Thể Loại</p>
            <div className="grid grid-cols-3 gap-1">
              {CATEGORIES.map((c) => (
                <Link key={c.to} to={c.to} className="text-xs py-1 transition-colors truncate" style={{ color: '#b3b3b3' }}
                  onMouseEnter={(e) => { e.currentTarget.style.color = 'var(--primary)' }}
                  onMouseLeave={(e) => { e.currentTarget.style.color = '#b3b3b3' }}
                >{c.label}</Link>
              ))}
            </div>
          </div>
          <div className="pt-2 border-t" style={{ borderColor: 'var(--border-color)' }}>
            <p className="text-xs mb-2 uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>Quốc Gia</p>
            <div className="grid grid-cols-3 gap-1">
              {COUNTRIES.map((c) => (
                <Link key={c.to} to={c.to} className="text-xs py-1 transition-colors truncate" style={{ color: '#b3b3b3' }}
                  onMouseEnter={(e) => { e.currentTarget.style.color = 'var(--primary)' }}
                  onMouseLeave={(e) => { e.currentTarget.style.color = '#b3b3b3' }}
                >{c.label}</Link>
              ))}
            </div>
          </div>

          {/* Mobile auth */}
          <div className="pt-2 border-t" style={{ borderColor: 'var(--border-color)' }}>
            {user ? (
              <div className="flex items-center justify-between">
                <span className="text-xs truncate" style={{ color: 'var(--text-muted)' }}>{user.email}</span>
                <button onClick={signOut} className="text-xs px-3 py-1 rounded-lg" style={{ background: 'var(--bg-3)', color: 'var(--text-muted)' }}>
                  Đăng xuất
                </button>
              </div>
            ) : (
              <button
                onClick={() => { setAuthOpen(true); setMenuOpen(false) }}
                className="w-full py-2 rounded-lg text-sm font-medium"
                style={{ background: 'var(--primary)', color: 'var(--primary-btn-text, #fff)' }}
              >
                Đăng nhập
              </button>
            )}
          </div>
        </nav>
      )}

      {authOpen && <AuthModal onClose={() => setAuthOpen(false)} />}
    </header>
  )
}
