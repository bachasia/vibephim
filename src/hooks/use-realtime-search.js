import { useState, useEffect } from 'react'
import { searchMovies } from '../services/ophim-api.js'

function extractActors(movies) {
  const seen = new Set()
  const actors = []
  for (const movie of movies) {
    for (const actor of (movie.actor || [])) {
      if (!seen.has(actor) && actors.length < 5) {
        seen.add(actor)
        actors.push(actor)
      }
    }
  }
  return actors
}

export function useRealtimeSearch(query) {
  const [movies, setMovies] = useState([])
  const [actors, setActors] = useState([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const q = query.trim()
    if (q.length < 2) {
      setMovies([])
      setActors([])
      return
    }

    let cancelled = false
    const timer = setTimeout(() => {
      setLoading(true)
      searchMovies(q, 1)
        .then((data) => {
          if (cancelled) return
          const items = data.data?.items || []
          setMovies(items.slice(0, 5))
          setActors(extractActors(items))
        })
        .catch(() => { if (!cancelled) { setMovies([]); setActors([]) } })
        .finally(() => { if (!cancelled) setLoading(false) })
    }, 300)

    return () => { cancelled = true; clearTimeout(timer) }
  }, [query])

  return { movies, actors, loading }
}
