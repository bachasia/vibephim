import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { useCategoryMovies } from '../hooks/use-categories.js'
import MovieGrid from '../components/movie/movie-grid.jsx'
import Pagination from '../components/ui/pagination.jsx'

export default function CategoryPage() {
  const { slug } = useParams()
  const [page, setPage] = useState(1)
  const { movies, pagination, categoryInfo, loading, error } = useCategoryMovies(slug, page)

  useEffect(() => {
    document.title = categoryInfo ? `${categoryInfo} - VibePHim` : 'Thể loại - VibePHim'
  }, [categoryInfo])

  const totalPages = pagination ? Math.ceil(pagination.totalItems / pagination.totalItemsPerPage) : 1

  function handlePageChange(p) {
    setPage(p)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <div className="min-h-screen pt-28 text-white" style={{ background: 'var(--bg-color)' }}>
      <div className="max-w-screen-xl mx-auto px-6 md:px-12">
        <h1 className="text-xl font-bold mb-6 text-white">
          {categoryInfo || 'Thể loại'}
        </h1>

        {error && <p className="text-zinc-500 text-sm mb-4">{error}</p>}

        <MovieGrid movies={movies} loading={loading} />
        <Pagination currentPage={page} totalPages={totalPages} onPageChange={handlePageChange} />
      </div>
    </div>
  )
}
