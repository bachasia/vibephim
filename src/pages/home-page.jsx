import { useState, useEffect } from 'react'
import { getNewestMovies, getMoviesByType, getMoviesByCountry } from '../services/ophim-api.js'
import { MOVIE_TYPES } from '../utils/constants.js'
import HeroBanner from '../components/movie/hero-banner.jsx'
import CategoryTopics from '../components/movie/category-topics.jsx'
import MovieCarousel from '../components/movie/movie-carousel.jsx'
import Top10Carousel from '../components/movie/top10-carousel.jsx'

export default function HomePage() {
  const [data, setData] = useState({})
  const [loading, setLoading] = useState(true)

  useEffect(() => { document.title = 'VibePHim - Xem Phim Online Miễn Phí' }, [])

  useEffect(() => {
    let cancelled = false

    Promise.all([
      getNewestMovies(1),
      getMoviesByCountry('han-quoc', 1),
      getMoviesByCountry('trung-quoc', 1),
      getMoviesByCountry('au-my', 1),
      getMoviesByType(MOVIE_TYPES.SERIES, 1),
      getMoviesByType(MOVIE_TYPES.MOVIE, 1),
      getMoviesByType(MOVIE_TYPES.ANIME, 1),
      getMoviesByType(MOVIE_TYPES.TV, 1),
    ])
      .then(([newest, korea, china, usuk, series, movies, anime, tv]) => {
        if (cancelled) return

        const pick = (res) =>
          res?.data?.items || res?.items || []

        setData({
          newest:  pick(newest),
          korea:   pick(korea),
          china:   pick(china),
          usuk:    pick(usuk),
          series:  pick(series),
          movies:  pick(movies),
          anime:   pick(anime),
          tv:      pick(tv),
        })
      })
      .catch(() => {})
      .finally(() => { if (!cancelled) setLoading(false) })

    return () => { cancelled = true }
  }, [])

  return (
    <div className="min-h-screen text-white" style={{ background: 'var(--bg-color)' }}>
      <HeroBanner movies={data.newest || []} loading={loading} />
      <CategoryTopics />

      {/* Country sections */}
      <MovieCarousel
        title="Phim Hàn Quốc Mới"
        movies={data.korea || []}
        loading={loading}
        browseLink="/quoc-gia/han-quoc"
      />
      <MovieCarousel
        title="Phim Trung Quốc Mới"
        movies={data.china || []}
        loading={loading}
        browseLink="/quoc-gia/trung-quoc"
      />
      <MovieCarousel
        title="Phim US-UK Mới"
        movies={data.usuk || []}
        loading={loading}
        browseLink="/quoc-gia/au-my"
      />

      {/* Divider */}
      <div className="h-px mx-6 md:mx-12 my-2" style={{ background: 'rgba(255,255,255,0.06)' }} />

      {/* Type sections */}
      <MovieCarousel
        title="Phim Bộ Mới"
        movies={data.series || []}
        loading={loading}
        browseLink={`/browse?type=${MOVIE_TYPES.SERIES}`}
      />

      <Top10Carousel
        title="Top 10 Phim Bộ Hôm Nay"
        movies={(data.series || []).slice(0, 10)}
        loading={loading}
        browseLink={`/browse?type=${MOVIE_TYPES.SERIES}`}
      />

      <MovieCarousel
        title="Phim Lẻ Mới"
        movies={data.movies || []}
        loading={loading}
        browseLink={`/browse?type=${MOVIE_TYPES.MOVIE}`}
      />

      <Top10Carousel
        title="Top 10 Phim Lẻ Hay Nhất"
        movies={(data.movies || []).slice(0, 10)}
        loading={loading}
        browseLink={`/browse?type=${MOVIE_TYPES.MOVIE}`}
      />

      <MovieCarousel
        title="Hoạt Hình Mới"
        movies={data.anime || []}
        loading={loading}
        browseLink={`/browse?type=${MOVIE_TYPES.ANIME}`}
      />

      <MovieCarousel
        title="TV Shows"
        movies={data.tv || []}
        loading={loading}
        browseLink={`/browse?type=${MOVIE_TYPES.TV}`}
      />

      {/* Phim mới nhất tổng hợp */}
      <div className="h-px mx-6 md:mx-12 my-2" style={{ background: 'rgba(255,255,255,0.06)' }} />
      <MovieCarousel
        title="Phim Mới Cập Nhật"
        movies={data.newest || []}
        loading={loading}
        browseLink="/browse"
      />
    </div>
  )
}
