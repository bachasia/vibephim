import { Link } from 'react-router-dom'
import { useFavorites } from '../../contexts/favorites-context.jsx'

function IconBtn({ icon, label, onClick, disabled }) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className="flex flex-col items-center gap-1 px-3 py-2.5 text-[11px] shrink-0 transition-colors disabled:opacity-30"
      style={{ color: 'var(--text-muted)', background: 'none' }}
      onMouseEnter={e => { if (!disabled) e.currentTarget.style.color = '#fff' }}
      onMouseLeave={e => { if (!disabled) e.currentTarget.style.color = 'var(--text-muted)' }}
    >
      {icon}
      <span className="whitespace-nowrap">{label}</span>
    </button>
  )
}

function NavBtn({ to, icon, label, style }) {
  return (
    <Link
      to={to}
      className="flex flex-col items-center gap-1 px-3 py-2.5 text-[11px] shrink-0 transition-colors"
      style={style}
      onMouseEnter={e => { e.currentTarget.style.opacity = '0.8' }}
      onMouseLeave={e => { e.currentTarget.style.opacity = '1' }}
    >
      {icon}
      <span className="whitespace-nowrap">{label}</span>
    </Link>
  )
}

const PrevIcon = () => (
  <svg width="16" height="14" viewBox="0 0 320 512" fill="currentColor">
    <path d="M41.4 233.4c-12.5 12.5-12.5 32.8 0 45.3l160 160c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L109.3 256 246.6 118.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0l-160 160z"/>
  </svg>
)

const NextIcon = () => (
  <svg width="16" height="14" viewBox="0 0 320 512" fill="currentColor">
    <path d="M278.6 233.4c12.5 12.5 12.5 32.8 0 45.3l-160 160c-12.5 12.5-32.8 12.5-45.3 0s-12.5-32.8 0-45.3L210.7 256 73.4 118.6c-12.5-12.5-12.5-32.8 0-45.3s32.8-12.5 45.3 0l160 160z"/>
  </svg>
)

const ShareIcon = () => (
  <svg width="14" height="14" viewBox="0 0 512 512" fill="currentColor">
    <path d="M307 34.8c-11.5 5.1-19 16.6-19 29.2v64H176C78.8 128 0 206.8 0 304C0 417.3 81.5 467.9 100.2 478.1c2.5 1.4 5.3 1.9 8.1 1.9c10.9 0 19.7-8.9 19.7-19.7c0-7.5-4.3-14.4-9.8-19.5C108.8 431.9 96 414.4 96 384c0-53 43-96 96-96h96v64c0 12.6 7.4 24.1 19 29.2s25 3 34.4-5.4l160-144c6.7-6.1 10.6-14.7 10.6-23.8s-3.9-17.7-10.6-23.8l-160-144c-9.4-8.5-22.9-10.6-34.4-5.4z"/>
  </svg>
)

const ReportIcon = () => (
  <svg width="14" height="14" viewBox="0 0 448 512" fill="currentColor">
    <path d="M64 32C28.7 32 0 60.7 0 96V416c0 35.3 28.7 64 64 64H384c35.3 0 64-28.7 64-64V96c0-35.3-28.7-64-64-64H64zm79 191l-17 113c-.6 4 .9 8 4 10.7s7.3 3.5 11.2 2.2l57.5-19.2 57.5 19.2c3.9 1.3 8.1.5 11.2-2.2s4.6-6.7 4-10.7l-17-113 79.4-61.7c3.4-2.6 5.1-6.7 4.4-10.7s-3.7-7.4-7.5-8.8L305 127.4 279.3 84.5c-1.8-3-5.1-4.9-8.6-4.9s-6.8 1.9-8.6 4.9l-25.7 42.9-74.2 14.4c-3.8 1.4-6.8 4.8-7.5 8.8s1 8.1 4.4 10.7L143 223z"/>
  </svg>
)

const WatchTogetherIcon = () => (
  <svg width="16" height="14" viewBox="0 0 640 512" fill="currentColor">
    <path d="M72 88a56 56 0 1 1 112 0A56 56 0 1 1 72 88zM64 245.7C54 256.9 48 271.8 48 288s6 31.1 16 42.3V245.7zm144.4-49.3C178.7 222.7 160 261.2 160 304c0 34.3 12 65.8 32 90.5V416c0 17.7-14.3 32-32 32H96c-17.7 0-32-14.3-32-32V389.2C26.2 371.2 0 338.2 0 304c0-34.3 13.5-65.5 35.5-88.2C16.3 198.6 0 175.2 0 148c0-44.2 35.8-80 80-80s80 35.8 80 80c0 27.2-16.3 50.6-35.5 67.8c3.4-3.5 7-6.8 10.9-9.8zM480 144a56 56 0 1 1 112 0 56 56 0 1 1 -112 0zM560 388.4c-24.2 15.5-53.3 23.6-84 23.6s-59.8-8.1-84-23.6V416c0 17.7-14.3 32-32 32H288c-17.7 0-32-14.3-32-32V304c0-44.2 35.8-80 80-80h80c44.2 0 80 35.8 80 80v112.4zM576 245.7v84.7c10-11.3 16-26.1 16-42.3s-6-31.1-16-42.3zM256 128a64 64 0 1 1 128 0 64 64 0 1 1 -128 0z"/>
  </svg>
)

export default function WatchActionBar({ slug, prevEp, nextEp, movie }) {
  const { isFavorite, addFavorite, removeFavorite } = useFavorites()
  const favorited = movie ? isFavorite(slug) : false

  function handleShare() {
    if (navigator.share) navigator.share({ url: window.location.href })
    else navigator.clipboard?.writeText(window.location.href)
  }

  return (
    <div style={{ background: 'var(--top-bg)', borderBottom: '1px solid var(--border-color)' }}>
      <div className="max-w-[1200px] mx-auto px-2">
        <div className="flex items-center overflow-x-auto">
          {prevEp
            ? <NavBtn to={`/xem/${slug}/${prevEp.slug}`} icon={<PrevIcon />} label="Tập trước" style={{ color: 'var(--text-base)' }} />
            : <IconBtn icon={<PrevIcon />} label="Tập trước" disabled />
          }

          <div className="h-7 w-px mx-1 shrink-0" style={{ background: 'var(--border-color)' }} />

          <IconBtn
            icon={
              <svg width="14" height="14" viewBox="0 0 512 512" fill={favorited ? 'var(--primary)' : 'currentColor'} style={{ color: favorited ? 'var(--primary)' : undefined }}>
                <path d="M0 96C0 60.7 28.7 32 64 32l384 0c35.3 0 64 28.7 64 64l0 320c0 35.3-28.7 64-64 64L64 480c-35.3 0-64-28.7-64-64L0 96zM256 160c-13.3 0-24 10.7-24 24v72H160c-13.3 0-24 10.7-24 24s10.7 24 24 24h72v72c0 13.3 10.7 24 24 24s24-10.7 24-24V304h72c13.3 0 24-10.7 24-24s-10.7-24-24-24H280V184c0-13.3-10.7-24-24-24z"/>
              </svg>
            }
            label="Thêm vào"
            onClick={() => movie && (favorited ? removeFavorite(slug) : addFavorite(movie))}
          />
          <IconBtn
            icon={
              <svg width="14" height="14" viewBox="0 0 512 512" fill="currentColor">
                <path d="M463.5 224H472c13.3 0 24-10.7 24-24V72c0-9.7-5.8-18.5-14.8-22.2s-19.3-1.7-26.2 5.2L413.4 96.6c-87.6-86.5-228.7-86.2-315.8 1c-87.5 87.5-87.5 229.3 0 316.8s229.3 87.5 316.8 0c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0c-62.5 62.5-163.8 62.5-226.3 0s-62.5-163.8 0-226.3c62.2-62.2 162.7-62.5 225.3-1L327 183c-6.9 6.9-8.9 17.2-5.2 26.2s12.5 14.8 22.2 14.8H463.5z"/>
              </svg>
            }
            label="Chuyển tập"
          />
          <IconBtn icon={<ShareIcon />} label="Chia sẻ" onClick={handleShare} />
          <IconBtn icon={<WatchTogetherIcon />} label="Xem chung" />

          <div className="ml-auto" />

          <IconBtn icon={<ReportIcon />} label="Báo lỗi" />

          <div className="h-7 w-px mx-1 shrink-0" style={{ background: 'var(--border-color)' }} />

          {nextEp
            ? <NavBtn to={`/xem/${slug}/${nextEp.slug}`} icon={<NextIcon />} label="Tập sau" style={{ color: 'var(--primary)' }} />
            : <IconBtn icon={<NextIcon />} label="Tập sau" disabled />
          }
        </div>
      </div>
    </div>
  )
}
