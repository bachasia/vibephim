import { useMemo, useCallback, useRef } from 'react'
import { useParams } from 'react-router-dom'
import { useMovieDetail } from '../hooks/use-movie-detail.js'
import { useWatchHistory } from '../contexts/watch-history-context.jsx'
import VideoPlayer from '../components/player/video-player.jsx'
import EpisodeSection from '../components/movie/episode-section.jsx'
import WatchActionBar from '../components/watch/watch-action-bar.jsx'
import WatchMovieInfo from '../components/watch/watch-movie-info.jsx'
import WatchSidebar from '../components/watch/watch-sidebar.jsx'
import WatchComments from '../components/watch/watch-comments.jsx'

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

  const firstServer = episodes[0]?.server_data || []
  const epIndex = firstServer.findIndex((e) => e.slug === ep)
  const prevEp = epIndex > 0 ? firstServer[epIndex - 1] : null
  const nextEp = epIndex >= 0 && epIndex < firstServer.length - 1 ? firstServer[epIndex + 1] : null

  const handleProgress = useCallback((currentTime) => {
    if (!movie) return
    clearTimeout(saveTimerRef.current)
    saveTimerRef.current = setTimeout(() => {
      addToHistory({
        slug, name: movie.name, thumb_url: movie.thumb_url,
        episode: ep, episodeName: currentEp?.name || ep, progress: currentTime,
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
        <p className="text-sm" style={{ color: 'var(--text-muted)' }}>{error || 'Không tìm thấy phim.'}</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen text-white" style={{ background: 'var(--bg-color)' }}>

      {/* Video player — full width */}
      <div className="w-full pt-16" style={{ background: '#000' }}>
        <div className="max-w-[1200px] mx-auto">
          {videoSrc
            ? <VideoPlayer src={videoSrc} title={playerTitle} initialTime={initialTime} onProgress={handleProgress} />
            : (
              <div className="aspect-video flex items-center justify-center" style={{ background: 'var(--bg-2)' }}>
                <p className="text-sm" style={{ color: 'var(--text-muted)' }}>Không có nguồn video cho tập này.</p>
              </div>
            )
          }
        </div>
      </div>

      {/* Action bar */}
      <WatchActionBar slug={slug} prevEp={prevEp} nextEp={nextEp} movie={movie} />

      {/* Main content */}
      <div className="max-w-[1200px] mx-auto px-4 py-5">
        <div className="flex gap-6 items-start">

          {/* Left — info + episodes + comments */}
          <div className="flex-1 min-w-0">
            <WatchMovieInfo movie={movie} slug={slug} currentEpName={currentEp?.name} />
            <div className="mt-2">
              <EpisodeSection episodes={episodes} movieSlug={slug} currentEpSlug={ep} />
            </div>
            <WatchComments />
          </div>

          {/* Right sidebar */}
          <aside className="w-[280px] shrink-0 hidden lg:block">
            <WatchSidebar movie={movie} />
          </aside>

        </div>
      </div>

    </div>
  )
}
