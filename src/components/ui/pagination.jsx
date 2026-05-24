export default function Pagination({ currentPage, totalPages, onPageChange }) {
  if (!totalPages || totalPages <= 1) return null

  // Build page number list with ellipsis, max 5 visible buttons
  function buildPages() {
    if (totalPages <= 7) return Array.from({ length: totalPages }, (_, i) => i + 1)
    const pages = []
    pages.push(1)
    if (currentPage > 4) pages.push('...')
    const start = Math.max(2, currentPage - 1)
    const end = Math.min(totalPages - 1, currentPage + 1)
    for (let i = start; i <= end; i++) pages.push(i)
    if (currentPage < totalPages - 3) pages.push('...')
    pages.push(totalPages)
    return pages
  }

  const pages = buildPages()

  return (
    <nav className="flex items-center justify-center gap-1 py-8" aria-label="Phân trang">
      {/* Prev */}
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage <= 1}
        aria-label="Trang trước"
        className="px-3 py-1.5 rounded-sm text-sm text-zinc-300 hover:text-white hover:bg-white/10 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
      >
        ‹ Trước
      </button>

      {/* Page numbers */}
      {pages.map((p, i) =>
        p === '...' ? (
          <span key={`ellipsis-${i}`} className="px-2 text-zinc-500 text-sm select-none">…</span>
        ) : (
          <button
            key={p}
            onClick={() => onPageChange(p)}
            aria-current={p === currentPage ? 'page' : undefined}
            className="w-9 h-9 rounded-sm text-sm font-medium transition-colors"
            style={p === currentPage
              ? { background: 'var(--primary)', color: 'var(--primary-btn-text)' }
              : { color: 'var(--text-base)' }
            }
            onMouseEnter={(e) => { if (p !== currentPage) e.currentTarget.style.color = '#fff' }}
            onMouseLeave={(e) => { if (p !== currentPage) e.currentTarget.style.color = 'var(--text-base)' }}
          >
            {p}
          </button>
        )
      )}

      {/* Next */}
      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage >= totalPages}
        aria-label="Trang sau"
        className="px-3 py-1.5 rounded-sm text-sm text-zinc-300 hover:text-white hover:bg-white/10 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
      >
        Sau ›
      </button>
    </nav>
  )
}
