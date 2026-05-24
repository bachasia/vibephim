import { useState, useRef, useEffect } from 'react'
import { Link } from 'react-router-dom'

/**
 * Hover/click dropdown for header nav. Items: [{ label, to }]
 */
export default function NavDropdown({ label, items, columns = 3 }) {
  const [open, setOpen] = useState(false)
  const ref = useRef(null)
  const timerRef = useRef(null)

  function openMenu() {
    clearTimeout(timerRef.current)
    setOpen(true)
  }

  function closeMenu() {
    timerRef.current = setTimeout(() => setOpen(false), 120)
  }

  // Close on outside click
  useEffect(() => {
    if (!open) return
    function handler(e) {
      if (!ref.current?.contains(e.target)) setOpen(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [open])

  return (
    <div
      ref={ref}
      className="relative"
      onMouseEnter={openMenu}
      onMouseLeave={closeMenu}
    >
      <button
        className="flex items-center gap-1 px-3 py-1.5 rounded-sm text-sm transition-colors duration-200 whitespace-nowrap"
        style={{ color: open ? '#ffffff' : '#b3b3b3', fontWeight: '500' }}
        onClick={() => setOpen((v) => !v)}
      >
        {label}
        <svg
          width="12" height="12" viewBox="0 0 24 24" fill="none"
          stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"
          style={{ transition: 'transform 200ms', transform: open ? 'rotate(180deg)' : 'rotate(0)' }}
        >
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </button>

      {open && (
        <div
          className="absolute top-full right-0 pt-2 z-50"
          style={{ minWidth: '320px' }}
          onMouseEnter={openMenu}
          onMouseLeave={closeMenu}
        >
          <div
            className="rounded-sm overflow-hidden py-3 px-3"
            style={{
              background: 'rgba(15,17,26,0.99)',
              border: '1px solid var(--border-color)',
              backdropFilter: 'blur(12px)',
            }}
          >
            <div
              className="grid gap-1"
              style={{ gridTemplateColumns: `repeat(${columns}, 1fr)` }}
            >
              {items.map((item) => (
                <Link
                  key={item.to}
                  to={item.to}
                  onClick={() => setOpen(false)}
                  className="px-2 py-1.5 rounded-sm text-sm transition-colors duration-150 truncate"
                  style={{ color: 'var(--text-base)' }}
                  onMouseEnter={(e) => { e.currentTarget.style.color = 'var(--primary)'; e.currentTarget.style.background = 'var(--bg-3)' }}
                  onMouseLeave={(e) => { e.currentTarget.style.color = 'var(--text-base)'; e.currentTarget.style.background = '' }}
                >
                  {item.label}
                </Link>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
