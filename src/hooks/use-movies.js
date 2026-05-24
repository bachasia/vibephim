import { useState, useEffect } from 'react'
import { getNewestMovies } from '../services/ophim-api.js'

export function useMovies(page = 1) {
  const [movies, setMovies] = useState([])
  const [pagination, setPagination] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    let cancelled = false
    setLoading(true)
    setError(null)

    getNewestMovies(page)
      .then((data) => {
        if (cancelled) return
        setMovies(data.items || [])
        setPagination(data.pagination || null)
      })
      .catch((err) => {
        if (cancelled) return
        setError(err.message)
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })

    return () => { cancelled = true }
  }, [page])

  return { movies, pagination, loading, error }
}
