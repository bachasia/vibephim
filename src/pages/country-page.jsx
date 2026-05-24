import { useState } from 'react'
import { useParams } from 'react-router-dom'
import { useCountryMovies } from '../hooks/use-categories.js'
import MovieGrid from '../components/movie/movie-grid.jsx'
import Pagination from '../components/ui/pagination.jsx'

export default function CountryPage() {
  const { slug } = useParams()
  const [page, setPage] = useState(1)
  const { movies, pagination, countryInfo, loading, error } = useCountryMovies(slug, page)

  const totalPages = pagination ? Math.ceil(pagination.totalItems / pagination.totalItemsPerPage) : 1

  function handlePageChange(p) {
    setPage(p)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <div className="min-h-screen bg-zinc-950 text-white pt-20">
      <div className="max-w-screen-xl mx-auto px-6 md:px-12">
        <h1 className="text-xl font-bold mb-6 text-white">
          {countryInfo || 'Quốc gia'}
        </h1>

        {error && <p className="text-zinc-500 text-sm mb-4">{error}</p>}

        <MovieGrid movies={movies} loading={loading} />
        <Pagination currentPage={page} totalPages={totalPages} onPageChange={handlePageChange} />
      </div>
    </div>
  )
}
