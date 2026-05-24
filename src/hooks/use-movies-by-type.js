import { useState, useEffect } from 'react'
import { getMoviesByType } from '../services/ophim-api.js'

export function useMoviesByType(type, page = 1) {
  const [movies, setMovies] = useState([])
  const [pagination, setPagination] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (!type) return
    let cancelled = false
    setLoading(true)
    setError(null)

    getMoviesByType(type, page)
      .then((data) => {
        if (cancelled) return
        setMovies(data.data?.items || data.items || [])
        setPagination(data.data?.params?.pagination || data.pagination || null)
      })
      .catch((err) => {
        if (cancelled) return
        setError(err.message)
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })

    return () => { cancelled = true }
  }, [type, page])

  return { movies, pagination, loading, error }
}
