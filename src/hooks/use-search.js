import { useState, useEffect } from 'react'
import { searchMovies } from '../services/ophim-api.js'

export function useSearch(keyword, page = 1) {
  const [results, setResults] = useState([])
  const [pagination, setPagination] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (!keyword || keyword.trim().length < 2) {
      setResults([])
      setPagination(null)
      return
    }

    let cancelled = false
    setLoading(true)
    setError(null)

    searchMovies(keyword.trim(), page)
      .then((data) => {
        if (cancelled) return
        setResults(data.data?.items || [])
        setPagination(data.data?.params?.pagination || null)
      })
      .catch((err) => {
        if (cancelled) return
        setError(err.message)
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })

    return () => { cancelled = true }
  }, [keyword, page])

  return { results, pagination, loading, error }
}
