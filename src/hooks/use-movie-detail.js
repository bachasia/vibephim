import { useState, useEffect } from 'react'
import { getMovieDetail } from '../services/ophim-api.js'

export function useMovieDetail(slug) {
  const [movie, setMovie] = useState(null)
  const [episodes, setEpisodes] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (!slug) return
    let cancelled = false
    setLoading(true)
    setError(null)

    getMovieDetail(slug)
      .then((data) => {
        if (cancelled) return
        setMovie(data.movie || null)
        setEpisodes(data.episodes || [])
      })
      .catch((err) => {
        if (cancelled) return
        setError(err.message)
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })

    return () => { cancelled = true }
  }, [slug])

  return { movie, episodes, loading, error }
}
