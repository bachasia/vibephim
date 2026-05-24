import { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import { getNewestMovies, getMoviesByType, getMoviesByCategory, getMoviesByCountry } from '../services/ophim-api.js'
import { useCategories, useCountries } from '../hooks/use-categories.js'
import { MOVIE_TYPES } from '../utils/constants.js'
import MovieGrid from '../components/movie/movie-grid.jsx'
import Pagination from '../components/ui/pagination.jsx'

const TYPE_OPTIONS = [
  { value: '', label: 'Tất cả' },
  { value: MOVIE_TYPES.SERIES, label: 'Phim Bộ' },
  { value: MOVIE_TYPES.MOVIE,  label: 'Phim Lẻ' },
  { value: MOVIE_TYPES.ANIME,  label: 'Hoạt Hình' },
  { value: MOVIE_TYPES.TV,     label: 'TV Shows' },
]

const YEAR_OPTIONS = [
  { value: '', label: 'Năm' },
  ...Array.from({ length: 10 }, (_, i) => {
    const y = new Date().getFullYear() - i
    return { value: String(y), label: String(y) }
  }),
]

const SELECT_STYLE = {
  padding: '8px 32px 8px 12px',
  background: 'var(--bg-3)',
  border: '1px solid rgba(255,255,255,0.2)',
  borderRadius: '2px',
  color: '#ffffff',
  fontSize: '14px',
  appearance: 'none',
  WebkitAppearance: 'none',
  backgroundImage: "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%23b3b3b3' stroke-width='2'%3E%3Cpath d='M6 9l6 6 6-6'/%3E%3C/svg%3E\")",
  backgroundRepeat: 'no-repeat',
  backgroundPosition: 'right 8px center',
  cursor: 'pointer',
  fontFamily: 'inherit',
  outline: 'none',
}

function FilterSelect({ value, onChange, options }) {
  return (
    <select value={value} onChange={(e) => onChange(e.target.value)} style={SELECT_STYLE}>
      {options.map((o) => (
        <option key={o.value} value={o.value}>{o.label}</option>
      ))}
    </select>
  )
}

export default function BrowsePage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const type     = searchParams.get('type')     || ''
  const category = searchParams.get('category') || ''
  const country  = searchParams.get('country')  || ''
  const year     = searchParams.get('year')      || ''
  const page     = parseInt(searchParams.get('page') || '1', 10)

  const [movies, setMovies]         = useState([])
  const [totalPages, setTotalPages] = useState(1)
  const [totalItems, setTotalItems] = useState(0)
  const [loading, setLoading]       = useState(true)

  const { categories } = useCategories()
  const { countries }  = useCountries()

  useEffect(() => {
    let cancelled = false
    setLoading(true)

    let request
    if (category)     request = getMoviesByCategory(category, page)
    else if (country) request = getMoviesByCountry(country, page)
    else if (type)    request = getMoviesByType(type, page)
    else              request = getNewestMovies(page)

    request
      .then((data) => {
        if (cancelled) return
        const items = data.data?.items || data.items || []
        const pag   = data.data?.params?.pagination || data.pagination || null
        setMovies(items)
        if (pag) {
          setTotalItems(pag.totalItems || 0)
          setTotalPages(Math.ceil(pag.totalItems / pag.totalItemsPerPage))
        } else {
          setTotalItems(items.length)
          setTotalPages(1)
        }
      })
      .catch(() => { if (!cancelled) setMovies([]) })
      .finally(() => { if (!cancelled) setLoading(false) })

    return () => { cancelled = true }
  }, [type, category, country, page])

  function updateFilter(key, value) {
    const next = new URLSearchParams(searchParams)
    if (value) next.set(key, value)
    else next.delete(key)
    next.delete('page')
    setSearchParams(next)
  }

  function handlePageChange(p) {
    const next = new URLSearchParams(searchParams)
    next.set('page', String(p))
    setSearchParams(next)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const hasFilters = !!(type || category || country || year)

  const categoryOptions = [
    { value: '', label: 'Thể Loại' },
    ...categories.map((c) => ({ value: c.slug, label: c.name })),
  ]
  const countryOptions = [
    { value: '', label: 'Quốc Gia' },
    ...countries.map((c) => ({ value: c.slug, label: c.name })),
  ]

  return (
    <div className="min-h-screen text-white" style={{ background: '#000' }}>
      {/* Section header */}
      <div
        className="flex items-end justify-between px-8 pt-24 pb-0"
        style={{ marginBottom: '20px' }}
      >
        <div>
          <h1 className="text-2xl font-bold text-white">Duyệt Phim</h1>
          <p className="text-sm mt-1 font-mono" style={{ color: '#b3b3b3' }}>
            Khám phá kho phim phong phú
          </p>
        </div>
      </div>

      {/* Sticky filter bar */}
      <div
        className="sticky z-10 flex flex-wrap items-center gap-3 px-8 py-3"
        style={{
          top: '64px',
          background: 'var(--bg-2)',
          borderBottom: '1px solid rgba(255,255,255,0.1)',
        }}
      >
        <FilterSelect
          value={category}
          onChange={(v) => updateFilter('category', v)}
          options={categoryOptions}
        />
        <FilterSelect
          value={country}
          onChange={(v) => updateFilter('country', v)}
          options={countryOptions}
        />
        <FilterSelect
          value={year}
          onChange={(v) => updateFilter('year', v)}
          options={YEAR_OPTIONS}
        />
        <FilterSelect
          value={type}
          onChange={(v) => updateFilter('type', v)}
          options={TYPE_OPTIONS}
        />

        {hasFilters && (
          <button
            onClick={() => setSearchParams({})}
            className="text-sm transition-colors"
            style={{
              padding: '8px 16px',
              border: '1px solid rgba(255,255,255,0.2)',
              borderRadius: '2px',
              background: 'transparent',
              color: '#b3b3b3',
            }}
            onMouseEnter={(e) => { e.currentTarget.style.color = '#fff'; e.currentTarget.style.background = 'var(--bg-3)' }}
            onMouseLeave={(e) => { e.currentTarget.style.color = '#b3b3b3'; e.currentTarget.style.background = 'transparent' }}
          >
            Đặt lại
          </button>
        )}

        {!loading && totalItems > 0 && (
          <span
            className="ml-auto font-mono text-[11px]"
            style={{ color: '#737373' }}
          >
            {movies.length} / {totalItems} phim · trang {page}/{totalPages}
          </span>
        )}
      </div>

      {/* Grid */}
      <div className="px-8 pt-6 pb-8">
        <MovieGrid movies={movies} loading={loading} />
        <Pagination currentPage={page} totalPages={totalPages} onPageChange={handlePageChange} />
      </div>
    </div>
  )
}
