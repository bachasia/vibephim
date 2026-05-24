import { Link, useLocation } from 'react-router-dom'
import { MOVIE_TYPES } from '../../utils/constants.js'

const TABS = [
  {
    label: 'Trang chủ',
    to: '/',
    exact: true,
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
        <polyline points="9 22 9 12 15 12 15 22" />
      </svg>
    ),
  },
  {
    label: 'Phim bộ',
    to: `/browse?type=${MOVIE_TYPES.SERIES}`,
    type: MOVIE_TYPES.SERIES,
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="7" width="20" height="15" rx="2" ry="2" />
        <polyline points="17 2 12 7 7 2" />
      </svg>
    ),
  },
  {
    label: 'Tìm kiếm',
    to: '/tim-kiem',
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="11" cy="11" r="8" />
        <line x1="21" y1="21" x2="16.65" y2="16.65" />
      </svg>
    ),
  },
  {
    label: 'Yêu thích',
    to: '/yeu-thich',
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
      </svg>
    ),
  },
  {
    label: 'Lịch sử',
    to: '/lich-su',
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" />
        <polyline points="12 6 12 12 16 14" />
      </svg>
    ),
  },
]

function isTabActive(tab, pathname, searchType) {
  if (tab.exact) return pathname === '/'
  if (tab.type) return pathname === '/browse' && searchType === tab.type
  return pathname === tab.to
}

export default function MobileBottomNav() {
  const { pathname, search } = useLocation()
  const searchType = new URLSearchParams(search).get('type') || ''

  return (
    <nav
      className="md:hidden fixed bottom-0 left-0 right-0 z-50 flex items-stretch"
      style={{
        height: '60px',
        background: 'rgba(15,17,26,0.97)',
        borderTop: '1px solid var(--border-color)',
        backdropFilter: 'blur(12px)',
        paddingBottom: 'env(safe-area-inset-bottom)',
      }}
    >
      {TABS.map((tab) => {
        const active = isTabActive(tab, pathname, searchType)
        return (
          <Link
            key={tab.to}
            to={tab.to}
            className="flex-1 flex flex-col items-center justify-center gap-0.5 transition-colors duration-150"
            style={{ color: active ? 'var(--primary)' : 'var(--text-muted)' }}
          >
            {tab.icon}
            <span style={{ fontSize: '10px', fontWeight: active ? '600' : '400', lineHeight: 1 }}>
              {tab.label}
            </span>
          </Link>
        )
      })}
    </nav>
  )
}
