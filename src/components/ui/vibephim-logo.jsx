export default function VibephimLogo({ iconSize = 32, fontSize = 20, className = '' }) {
  return (
    <div className={`flex items-center gap-2.5 ${className}`} style={{ lineHeight: 1 }}>
      {/* Icon: dark navy badge with golden V */}
      <svg
        width={iconSize}
        height={iconSize}
        viewBox="0 0 32 32"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        style={{ flexShrink: 0 }}
      >
        <rect width="32" height="32" rx="7" fill="#ffd875" />
        {/* Film-reel notches */}
        <rect x="7" y="6" width="4" height="3" rx="1" fill="rgba(25,27,36,0.35)" />
        <rect x="21" y="6" width="4" height="3" rx="1" fill="rgba(25,27,36,0.35)" />
        {/* Bold V chevron */}
        <path
          d="M8 10L16 24L24 10"
          stroke="#191b24"
          strokeWidth="3.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>

      {/* Wordmark: white VIBE + golden PHIM */}
      <span style={{ fontWeight: 900, fontSize: `${fontSize}px`, letterSpacing: '-0.5px' }}>
        <span style={{ color: '#ffffff' }}>VIBE</span>
        <span style={{ color: 'var(--primary)' }}>PHIM</span>
      </span>
    </div>
  )
}
