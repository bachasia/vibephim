import { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import { useSearch } from '../hooks/use-search.js'
import MovieGrid from '../components/movie/movie-grid.jsx'
import Pagination from '../components/ui/pagination.jsx'

export default function SearchPage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const queryParam = searchParams.get('q') || ''
  const page = parseInt(searchParams.get('page') || '1', 10)

  const [inputValue, setInputValue] = useState(queryParam)

  useEffect(() => {
    const id = setTimeout(() => {
      const next = new URLSearchParams()
      if (inputValue.trim()) next.set('q', inputValue.trim())
      setSearchParams(next, { replace: true })
    }, 300)
    return () => clearTimeout(id)
  }, [inputValue]) // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => { setInputValue(queryParam) }, [queryParam])

  useEffect(() => {
    document.title = queryParam ? `Tìm: ${queryParam} - VibePHim` : 'Tìm kiếm - VibePHim'
  }, [queryParam])

  const { results, pagination, loading } = useSearch(queryParam, page)
  const totalPages = pagination ? Math.ceil(pagination.totalItems / pagination.totalItemsPerPage) : 1

  function handlePageChange(p) {
    const next = new URLSearchParams(searchParams)
    next.set('page', String(p))
    setSearchParams(next)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <div className="min-h-screen text-white" style={{ background: '#000' }}>
      {/* Search input — centered, wide */}
      <div className="pt-24 pb-5 px-8" style={{ maxWidth: '720px', margin: '0 auto' }}>
        <div className="relative">
          {/* Search icon */}
          <span
            className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none"
            style={{ color: '#b3b3b3', fontSize: '18px' }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
          </span>
          <input
            type="search"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Tìm phim, diễn viên..."
            autoFocus
            className="w-full text-white transition-colors duration-200"
            style={{
              padding: '16px 48px 16px 52px',
              background: 'var(--bg-2)',
              border: '2px solid rgba(255,255,255,0.2)',
              borderRadius: '8px',
              fontSize: '18px',
              fontFamily: 'inherit',
              outline: 'none',
            }}
            onFocus={(e) => { e.currentTarget.style.borderColor = 'var(--primary)' }}
            onBlur={(e) => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.2)' }}
          />
          {inputValue && (
            <button
              type="button"
              onClick={() => setInputValue('')}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-xl"
              style={{ color: '#b3b3b3', background: 'none', border: 'none', cursor: 'pointer' }}
            >
              ✕
            </button>
          )}
        </div>
      </div>

      {/* Results label */}
      {queryParam && !loading && results.length > 0 && (
        <div
          className="px-8 py-3 font-mono text-sm"
          style={{
            color: '#b3b3b3',
            borderBottom: '1px solid rgba(255,255,255,0.1)',
            maxWidth: '100%',
          }}
        >
          Kết quả cho <strong style={{ color: '#ffffff' }}>"{queryParam}"</strong> — {pagination?.totalItems || results.length} phim
        </div>
      )}

      {/* States */}
      {!queryParam && (
        <div className="px-8 py-20 text-center">
          <div className="text-5xl mb-5" style={{ color: 'rgba(255,255,255,0.2)' }}>
            <svg width="52" height="52" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ margin: '0 auto' }}>
              <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
          </div>
          <p className="text-xl font-bold mb-3">Tìm kiếm phim</p>
          <p className="text-base leading-relaxed" style={{ color: '#b3b3b3' }}>Nhập tên phim, diễn viên hoặc đạo diễn để tìm kiếm.</p>
        </div>
      )}

      {queryParam && !loading && results.length === 0 && (
        <div className="px-8 py-20 text-center">
          <div className="text-5xl mb-5" style={{ color: 'rgba(255,255,255,0.2)' }}>
            <svg width="52" height="52" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ margin: '0 auto' }}>
              <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
          </div>
          <p className="text-xl font-bold mb-3">Không tìm thấy phim nào</p>
          <p className="text-base leading-relaxed mb-7" style={{ color: '#b3b3b3' }}>
            Thử từ khóa khác hoặc kiểm tra lại chính tả.
          </p>
        </div>
      )}

      {queryParam && (
        <div className="px-8 pt-5 pb-8">
          <MovieGrid movies={results} loading={loading} />
          <Pagination currentPage={page} totalPages={totalPages} onPageChange={handlePageChange} />
        </div>
      )}
    </div>
  )
}
