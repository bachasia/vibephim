import { useState, useEffect } from 'react'
import { getNewestMovies, getMoviesByType } from '../services/ophim-api.js'
import { MOVIE_TYPES } from '../utils/constants.js'
import HeroBanner from '../components/movie/hero-banner.jsx'
import MovieCarousel from '../components/movie/movie-carousel.jsx'

const CAROUSELS = [
  { key: 'newest',              title: 'Phim Mới Cập Nhật', browseLink: '/browse' },
  { key: MOVIE_TYPES.SERIES,    title: 'Phim Bộ',           browseLink: `/browse?type=${MOVIE_TYPES.SERIES}` },
  { key: MOVIE_TYPES.MOVIE,     title: 'Phim Lẻ',           browseLink: `/browse?type=${MOVIE_TYPES.MOVIE}` },
  { key: MOVIE_TYPES.ANIME,     title: 'Hoạt Hình',         browseLink: `/browse?type=${MOVIE_TYPES.ANIME}` },
  { key: MOVIE_TYPES.TV,        title: 'TV Shows',           browseLink: `/browse?type=${MOVIE_TYPES.TV}` },
]

export default function HomePage() {
  const [data, setData] = useState({})
  const [loading, setLoading] = useState(true)

  useEffect(() => { document.title = 'VibePHim - Xem Phim Online Miễn Phí' }, [])

  useEffect(() => {
    let cancelled = false

    Promise.all([
      getNewestMovies(1),
      getMoviesByType(MOVIE_TYPES.SERIES, 1),
      getMoviesByType(MOVIE_TYPES.MOVIE, 1),
      getMoviesByType(MOVIE_TYPES.ANIME, 1),
      getMoviesByType(MOVIE_TYPES.TV, 1),
    ])
      .then(([newest, series, movies, anime, tv]) => {
        if (cancelled) return
        setData({
          newest:                 newest.items || [],
          [MOVIE_TYPES.SERIES]:   series.data?.items  || series.items  || [],
          [MOVIE_TYPES.MOVIE]:    movies.data?.items  || movies.items  || [],
          [MOVIE_TYPES.ANIME]:    anime.data?.items   || anime.items   || [],
          [MOVIE_TYPES.TV]:       tv.data?.items      || tv.items      || [],
        })
      })
      .catch(() => {})
      .finally(() => { if (!cancelled) setLoading(false) })

    return () => { cancelled = true }
  }, [])

  return (
    <div className="min-h-screen bg-zinc-950 text-white">
      <HeroBanner movies={data.newest || []} loading={loading} />

      {CAROUSELS.map(({ key, title, browseLink }) => (
        <MovieCarousel
          key={key}
          title={title}
          movies={data[key] || []}
          loading={loading}
          browseLink={browseLink}
        />
      ))}
    </div>
  )
}
