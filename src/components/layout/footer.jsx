import { Link } from 'react-router-dom'
import { MOVIE_TYPES } from '../../utils/constants.js'
import VibephimLogo from '../ui/vibephim-logo.jsx'

const COLS = [
  {
    title: 'Phim',
    links: [
      { label: 'Phim Mới', to: '/browse' },
      { label: 'Phim Bộ', to: `/browse?type=${MOVIE_TYPES.SERIES}` },
      { label: 'Phim Lẻ', to: `/browse?type=${MOVIE_TYPES.MOVIE}` },
      { label: 'Hoạt Hình', to: `/browse?type=${MOVIE_TYPES.ANIME}` },
      { label: 'TV Shows', to: `/browse?type=${MOVIE_TYPES.TV}` },
    ],
  },
  {
    title: 'Quốc Gia',
    links: [
      { label: 'Hàn Quốc', to: '/quoc-gia/han-quoc' },
      { label: 'Trung Quốc', to: '/quoc-gia/trung-quoc' },
      { label: 'Âu Mỹ', to: '/quoc-gia/au-my' },
      { label: 'Nhật Bản', to: '/quoc-gia/nhat-ban' },
      { label: 'Thái Lan', to: '/quoc-gia/thai-lan' },
    ],
  },
  {
    title: 'Thể Loại',
    links: [
      { label: 'Hành Động', to: '/the-loai/hanh-dong' },
      { label: 'Tình Cảm', to: '/the-loai/tinh-cam' },
      { label: 'Hài Hước', to: '/the-loai/hai-huoc' },
      { label: 'Kinh Dị', to: '/the-loai/kinh-di' },
      { label: 'Cổ Trang', to: '/the-loai/co-trang' },
    ],
  },
  {
    title: 'Tài Khoản',
    links: [
      { label: 'Yêu Thích', to: '/yeu-thich' },
      { label: 'Lịch Sử Xem', to: '/lich-su' },
      { label: 'Tìm Kiếm', to: '/tim-kiem' },
    ],
  },
]

export default function Footer() {
  return (
    <footer style={{ background: 'var(--footer-bg)', borderTop: '1px solid var(--border-color)' }}>
      <div className="max-w-screen-xl mx-auto px-6 md:px-12 pt-12 pb-24 md:pb-12">
        {/* Top grid */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8 mb-10">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <Link to="/" className="inline-block mb-4">
              <VibephimLogo iconSize={26} fontSize={17} />
            </Link>
            <p className="text-xs leading-relaxed mb-3" style={{ color: 'var(--text-muted)' }}>
              Xem phim online miễn phí, chất lượng cao, cập nhật liên tục.
            </p>
            <p className="text-xs font-semibold" style={{ color: 'var(--primary)' }}>
              Hoàng Sa &amp; Trường Sa là của Việt Nam!
            </p>
          </div>

          {COLS.map((col) => (
            <div key={col.title}>
              <h4
                className="text-sm font-semibold mb-3 uppercase tracking-wider"
                style={{ color: 'var(--primary)' }}
              >
                {col.title}
              </h4>
              <ul className="flex flex-col gap-2">
                {col.links.map((l) => (
                  <li key={l.to}>
                    <Link
                      to={l.to}
                      className="text-sm transition-colors duration-150"
                      style={{ color: 'var(--text-muted)' }}
                      onMouseEnter={(e) => { e.currentTarget.style.color = 'var(--primary)' }}
                      onMouseLeave={(e) => { e.currentTarget.style.color = 'var(--text-muted)' }}
                    >
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="h-px mb-6" style={{ background: 'var(--border-color)' }} />

        <div className="flex flex-col md:flex-row items-center justify-between gap-3 text-xs" style={{ color: 'var(--text-muted)' }}>
          <p>© {new Date().getFullYear()} VibePHim · Chỉ dùng cho mục đích học tập.</p>
          <p>
            Dữ liệu:{' '}
            <a href="https://ophim1.com" target="_blank" rel="noopener noreferrer"
              className="transition-colors" style={{ color: 'var(--text-base)' }}
              onMouseEnter={(e) => { e.currentTarget.style.color = 'var(--primary)' }}
              onMouseLeave={(e) => { e.currentTarget.style.color = 'var(--text-base)' }}
            >
              OPhim API
            </a>
          </p>
        </div>
      </div>
    </footer>
  )
}
