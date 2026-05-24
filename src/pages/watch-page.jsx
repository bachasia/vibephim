import { useMemo, useCallback, useRef } from 'react'
import { useParams, Link } from 'react-router-dom'
import { useMovieDetail } from '../hooks/use-movie-detail.js'
import { useWatchHistory } from '../contexts/watch-history-context.jsx'
import VideoPlayer from '../components/player/video-player.jsx'
import EpisodeSection from '../components/movie/episode-section.jsx'

// Find episode data across all servers, prefer first server
function findEpisode(episodes, epSlug) {
  for (const server of episodes) {
    const ep = server.server_data?.find((e) => e.slug === epSlug)
    if (ep) return ep
  }
  return null
}

export default function WatchPage() {
  const { slug, ep } = useParams()
  const { movie, episodes, loading, error } = useMovieDetail(slug)
  const { getProgress, addToHistory } = useWatchHistory()
  const saveTimerRef = useRef(null)

  const currentEp = useMemo(() => findEpisode(episodes, ep), [episodes, ep])
  const videoSrc = currentEp?.link_m3u8 || ''
  const playerTitle = movie ? `${movie.name}${currentEp?.name ? ` — ${currentEp.name}` : ''}` : ''
  const initialTime = movie ? getProgress(slug, ep) : 0

  // Find prev/next episode within first server for navigation
  const firstServer = episodes[0]?.server_data || []
  const epIndex = firstServer.findIndex((e) => e.slug === ep)
  const prevEp = epIndex > 0 ? firstServer[epIndex - 1] : null
  const nextEp = epIndex >= 0 && epIndex < firstServer.length - 1 ? firstServer[epIndex + 1] : null

  // Throttled progress save — every 5s
  const handleProgress = useCallback((currentTime) => {
    if (!movie) return
    clearTimeout(saveTimerRef.current)
    saveTimerRef.current = setTimeout(() => {
      addToHistory({
        slug,
        name: movie.name,
        thumb_url: movie.thumb_url,
        episode: ep,
        episodeName: currentEp?.name || ep,
        progress: currentTime,
      })
    }, 5000)
  }, [slug, ep, movie, currentEp, addToHistory])

  if (loading) {
    return (
      <div className="min-h-screen pt-16 flex items-center justify-center" style={{ background: 'var(--bg-color)' }}>
        <div className="w-10 h-10 border-4 border-white/20 border-t-white rounded-full animate-spin" />
      </div>
    )
  }

  if (error || !movie) {
    return (
      <div className="min-h-screen pt-20 flex items-center justify-center" style={{ background: 'var(--bg-color)' }}>
        <p className="text-zinc-400 text-sm">{error || 'Không tìm thấy phim.'}</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen text-white" style={{ background: 'var(--bg-color)' }}>
      {/* Full-width player area */}
      <div className="w-full pt-16" style={{ background: 'var(--top-bg)' }}>
        {videoSrc ? (
          <div className="max-w-6xl mx-auto">
            <VideoPlayer src={videoSrc} title={playerTitle} initialTime={initialTime} onProgress={handleProgress} />
          </div>
        ) : (
          <div className="max-w-6xl mx-auto aspect-video flex items-center justify-center" style={{ background: 'var(--bg-2)' }}>
            <p className="text-zinc-500 text-sm">Không có nguồn video cho tập này.</p>
          </div>
        )}
      </div>

      {/* Info bar below player */}
      <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between gap-4" style={{ borderBottom: '1px solid var(--border-color)' }}>
        <div className="min-w-0">
          <Link to={`/phim/${slug}`} className="text-base font-bold text-white hover:text-zinc-300 transition-colors line-clamp-1">
            {movie.name}
          </Link>
          {currentEp?.name && (
            <p className="text-sm text-zinc-400 mt-0.5">{currentEp.name}</p>
          )}
        </div>

        {/* Prev / Next episode nav */}
        <div className="flex items-center gap-2 shrink-0">
          {prevEp && (
            <Link
              to={`/xem/${slug}/${prevEp.slug}`}
              className="flex items-center gap-1 px-3 py-1.5 text-xs font-medium rounded-sm transition-colors"
              style={{ background: 'var(--bg-3)', color: 'var(--text-base)' }}
            >
              ‹ Tập trước
            </Link>
          )}
          {nextEp && (
            <Link
              to={`/xem/${slug}/${nextEp.slug}`}
              className="flex items-center gap-1 px-3 py-1.5 text-xs font-medium rounded-sm transition-colors"
              style={{ background: 'var(--primary)', color: 'var(--primary-btn-text)' }}
            >
              Tập sau ›
            </Link>
          )}
        </div>
      </div>

      {/* Episode list */}
      <div className="max-w-6xl mx-auto px-4 pb-16">
        <EpisodeSection episodes={episodes} movieSlug={slug} currentEpSlug={ep} />
      </div>
    </div>
  )
}
