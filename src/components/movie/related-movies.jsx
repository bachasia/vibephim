import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { getMoviesByCategory } from '../../services/ophim-api.js'
import { getImageUrl } from '../../services/ophim-api.js'

export default function RelatedMovies({ category = [], currentSlug }) {
  const [movies, setMovies] = useState([])

  const cat = category[0]

  useEffect(() => {
    if (!cat?.slug) return
    let cancelled = false
    getMoviesByCategory(cat.slug, 1)
      .then(data => {
        if (cancelled) return
        const items = (data.data?.items || data.items || [])
          .filter(m => m.slug !== currentSlug)
          .slice(0, 10)
        setMovies(items)
      })
      .catch(() => {})
    return () => { cancelled = true }
  }, [cat?.slug, currentSlug])

  if (!movies.length) return null

  return (
    <div className="mt-10">
      <h2 className="text-sm font-bold text-white mb-3 uppercase tracking-wide">Đề xuất cho bạn</h2>
      <div style={{ borderTop: '1px solid rgba(255,255,255,0.08)', marginBottom: '8px' }} />
      <div className="flex flex-col">
        {movies.map((movie, i) => (
          <Link
            key={movie.slug}
            to={`/phim/${movie.slug}`}
            className="flex gap-3 py-3 transition-opacity hover:opacity-80"
            style={{ borderBottom: i < movies.length - 1 ? '1px solid rgba(255,255,255,0.06)' : 'none' }}
          >
            <img
              src={getImageUrl(movie.thumb_url || movie.poster_url)}
              alt={movie.name}
              loading="lazy"
              className="rounded-sm shrink-0 object-cover"
              style={{ width: '60px', height: '80px' }}
              onError={e => { e.target.style.display = 'none' }}
            />
            <div className="flex flex-col justify-center min-w-0">
              <p
                className="text-sm font-semibold leading-snug line-clamp-2"
                style={{ color: '#fff' }}
              >
                {movie.name}
              </p>
              {movie.year && (
                <p className="text-xs mt-1" style={{ color: '#737373' }}>{movie.year}</p>
              )}
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}
