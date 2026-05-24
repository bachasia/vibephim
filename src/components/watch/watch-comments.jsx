import { useState } from 'react'

function Tab({ label, active, onClick }) {
  return (
    <button
      onClick={onClick}
      className="px-3 py-1 text-xs font-medium rounded-sm transition-colors"
      style={active
        ? { background: 'var(--primary)', color: 'var(--primary-btn-text)' }
        : { background: 'var(--bg-3)', color: 'var(--text-base)' }
      }
    >
      {label}
    </button>
  )
}

export default function WatchComments() {
  const [tab, setTab] = useState('comment')
  const [spoiler, setSpoiler] = useState(false)
  const [text, setText] = useState('')

  return (
    <div className="mt-8">
      {/* Header */}
      <div className="flex flex-wrap items-center gap-2 mb-4">
        <div className="flex items-center gap-1.5">
          <svg width="14" height="14" viewBox="0 0 512 512" fill="currentColor" style={{ color: 'var(--primary)' }}>
            <path d="M512 240c0 114.9-114.6 208-256 208c-37.1 0-72.3-6.4-104.1-17.9c-11.9 4.8-49.1 20.2-52.2 21.3c-15.6 5.8-31.7-7.4-28.2-23.8l10.1-58.4C14.2 320.1 0 281.5 0 240C0 125.1 114.6 32 256 32s256 93.1 256 208z"/>
          </svg>
          <span className="text-sm font-bold text-white">Bình luận (0)</span>
        </div>
        <div className="flex gap-1.5">
          <Tab label="Bình luận" active={tab === 'comment'} onClick={() => setTab('comment')} />
          <Tab label="Đánh giá" active={tab === 'rating'} onClick={() => setTab('rating')} />
        </div>
      </div>

      {tab === 'comment' && (
        <>
          {/* Input area */}
          <div
            className="rounded-sm overflow-hidden"
            style={{ border: '1px solid var(--border-color)', background: 'var(--bg-2)' }}
          >
            <div className="flex items-end justify-between px-3 py-1 text-xs" style={{ color: 'var(--text-muted)', borderBottom: '1px solid var(--border-color)' }}>
              <span>Vui lòng <span style={{ color: 'var(--primary)', cursor: 'pointer' }}>đăng nhập</span> để tham gia bình luận.</span>
              <span>{text.length} / 1000</span>
            </div>
            <textarea
              value={text}
              onChange={e => setText(e.target.value.slice(0, 1000))}
              placeholder="Viết bình luận..."
              rows={3}
              className="w-full px-3 py-2.5 text-sm resize-none bg-transparent text-white placeholder:text-zinc-600 focus:outline-none"
            />
            <div
              className="flex items-center justify-between px-3 py-2"
              style={{ borderTop: '1px solid var(--border-color)' }}
            >
              <label className="flex items-center gap-2 text-xs cursor-pointer select-none" style={{ color: 'var(--text-muted)' }}>
                <button
                  type="button"
                  onClick={() => setSpoiler(v => !v)}
                  className="relative rounded-full transition-colors"
                  style={{
                    width: '28px', height: '16px',
                    background: spoiler ? 'var(--primary)' : 'var(--bg-4)',
                  }}
                >
                  <span
                    className="absolute top-0.5 rounded-full transition-transform bg-white"
                    style={{
                      width: '12px', height: '12px',
                      left: '2px',
                      transform: spoiler ? 'translateX(12px)' : 'translateX(0)',
                    }}
                  />
                </button>
                Tiết lộ?
              </label>
              <button
                className="flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-sm transition-colors"
                style={{ background: 'var(--primary)', color: 'var(--primary-btn-text)' }}
              >
                Gửi
                <svg width="12" height="12" viewBox="0 0 512 512" fill="currentColor">
                  <path d="M498.1 5.6c10.1 7 15.4 19.1 13.5 31.2l-64 416c-1.5 9.7-7.4 18.2-16 23s-18.9 5.4-28 1.6L284 427.7l-68.5 74.1c-8.9 9.7-22.9 12.9-35.2 8.1S160 493.2 160 480V396.4c0-4 1.5-7.8 4.2-10.7L331.8 202.8c5.8-6.3 5.6-16-.4-22s-15.7-6.4-22-.7L106 360.8 17.7 316.6C7.1 311.3 .3 300.7 0 288.9s5.9-22.8 16.1-28.7l448-256c10.7-6.1 23.9-5.5 34 1.4z"/>
                </svg>
              </button>
            </div>
          </div>

          {/* Empty state */}
          <div className="flex flex-col items-center py-12 gap-3" style={{ color: 'var(--text-muted)' }}>
            <svg width="40" height="40" viewBox="0 0 512 512" fill="currentColor" style={{ opacity: 0.3 }}>
              <path d="M512 240c0 114.9-114.6 208-256 208c-37.1 0-72.3-6.4-104.1-17.9c-11.9 4.8-49.1 20.2-52.2 21.3c-15.6 5.8-31.7-7.4-28.2-23.8l10.1-58.4C14.2 320.1 0 281.5 0 240C0 125.1 114.6 32 256 32s256 93.1 256 208z"/>
            </svg>
            <span className="text-sm">Chưa có bình luận nào</span>
          </div>
        </>
      )}

      {tab === 'rating' && (
        <div className="flex flex-col items-center py-12 gap-3" style={{ color: 'var(--text-muted)' }}>
          <svg width="40" height="40" viewBox="0 0 576 512" fill="currentColor" style={{ opacity: 0.3 }}>
            <path d="M316.9 18C311.6 7 300.4 0 288.1 0s-23.4 7-28.8 18L195 150.3 51.4 171.5c-12 1.8-22 10.2-25.7 21.7s-.7 24.2 7.9 32.7L137.8 329 113.2 474.7c-2 12 3 24.2 12.9 31.3s23 8 33.8 2.3l128.3-68.5 128.3 68.5c10.8 5.7 23.9 4.9 33.8-2.3s14.9-19.3 12.9-31.3L438.5 329 542.7 225.9c8.6-8.5 11.7-21.2 7.9-32.7s-13.7-19.9-25.7-21.7L381.2 150.3 316.9 18z"/>
          </svg>
          <span className="text-sm">Chưa có đánh giá nào</span>
        </div>
      )}
    </div>
  )
}
