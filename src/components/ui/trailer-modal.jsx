import { useEffect } from 'react'

function getYouTubeEmbedUrl(url) {
  if (!url) return null
  // Already embed URL
  if (url.includes('youtube.com/embed/')) return url
  // youtu.be/ID
  const shortMatch = url.match(/youtu\.be\/([a-zA-Z0-9_-]+)/)
  if (shortMatch) return `https://www.youtube.com/embed/${shortMatch[1]}?autoplay=1`
  // youtube.com/watch?v=ID
  const watchMatch = url.match(/[?&]v=([a-zA-Z0-9_-]+)/)
  if (watchMatch) return `https://www.youtube.com/embed/${watchMatch[1]}?autoplay=1`
  return null
}

export default function TrailerModal({ url, onClose }) {
  const embedUrl = getYouTubeEmbedUrl(url)

  useEffect(() => {
    function onKey(e) { if (e.key === 'Escape') onClose() }
    document.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [onClose])

  if (!embedUrl) return null

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      style={{ background: 'rgba(0,0,0,0.85)' }}
      onClick={onClose}
    >
      <div
        className="relative w-full mx-4"
        style={{ maxWidth: '900px' }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute -top-10 right-0 text-white/70 hover:text-white transition-colors"
          aria-label="Đóng"
        >
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <line x1="18" y1="6" x2="6" y2="18"/>
            <line x1="6" y1="6" x2="18" y2="18"/>
          </svg>
        </button>

        {/* 16:9 iframe */}
        <div style={{ position: 'relative', paddingBottom: '56.25%', height: 0 }}>
          <iframe
            src={embedUrl}
            allow="autoplay; encrypted-media; fullscreen"
            allowFullScreen
            style={{
              position: 'absolute', top: 0, left: 0,
              width: '100%', height: '100%',
              border: 'none', borderRadius: '6px',
            }}
            title="Trailer"
          />
        </div>
      </div>
    </div>
  )
}
