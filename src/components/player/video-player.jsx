import { useRef, useState, useEffect, useCallback } from 'react'
import Hls from 'hls.js'
import PlayerControls from './player-controls.jsx'

const HIDE_DELAY = 3000

const INITIAL = {
  playing: false, currentTime: 0, duration: 0, buffered: 0,
  volume: 1, muted: false, isFullscreen: false,
  isBuffering: true, levels: [], currentLevel: -1,
  controlsVisible: true, error: null,
}

function SpinnerOverlay() {
  return (
    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
      <div className="w-12 h-12 border-4 border-white/20 border-t-white rounded-full animate-spin" />
    </div>
  )
}

export default function VideoPlayer({ src, title, onProgress, initialTime = 0 }) {
  const videoRef = useRef(null)
  const hlsRef = useRef(null)
  const containerRef = useRef(null)
  const hideTimerRef = useRef(null)
  const [state, setState] = useState(INITIAL)

  const update = useCallback((patch) => setState((s) => ({ ...s, ...patch })), [])

  // Reset hide timer — show controls, start 3s countdown
  const resetHideTimer = useCallback(() => {
    update({ controlsVisible: true })
    clearTimeout(hideTimerRef.current)
    hideTimerRef.current = setTimeout(() => update({ controlsVisible: false }), HIDE_DELAY)
  }, [update])

  // HLS setup
  useEffect(() => {
    if (!src) return
    const video = videoRef.current
    setState(INITIAL)

    function onTimeUpdate() {
      const buffered = video.buffered.length > 0 ? video.buffered.end(video.buffered.length - 1) : 0
      update({ currentTime: video.currentTime, buffered })
      onProgress?.(video.currentTime)
    }
    function onDurationChange() { update({ duration: video.duration }) }
    function onPlay()    { update({ playing: true,  isBuffering: false }) }
    function onPause()   { update({ playing: false }) }
    function onWaiting() { update({ isBuffering: true }) }
    function onCanPlay() { update({ isBuffering: false }) }
    function onVolumeChange() { update({ volume: video.volume, muted: video.muted }) }

    video.addEventListener('timeupdate', onTimeUpdate)
    video.addEventListener('durationchange', onDurationChange)
    video.addEventListener('play', onPlay)
    video.addEventListener('pause', onPause)
    video.addEventListener('waiting', onWaiting)
    video.addEventListener('canplay', onCanPlay)
    video.addEventListener('volumechange', onVolumeChange)

    // Safari native HLS
    if (!Hls.isSupported() && video.canPlayType('application/vnd.apple.mpegurl')) {
      video.src = src
      if (initialTime > 0) video.currentTime = initialTime
      video.play().catch(() => {})
    } else if (Hls.isSupported()) {
      const hls = new Hls({ startPosition: initialTime })
      hlsRef.current = hls
      hls.loadSource(src)
      hls.attachMedia(video)
      hls.on(Hls.Events.MANIFEST_PARSED, (_, data) => {
        update({ levels: data.levels, isBuffering: false })
        video.play().catch(() => {})
      })
      hls.on(Hls.Events.ERROR, (_, data) => {
        if (data.fatal) {
          if (data.type === Hls.ErrorTypes.NETWORK_ERROR) hls.startLoad()
          else if (data.type === Hls.ErrorTypes.MEDIA_ERROR) hls.recoverMediaError()
          else update({ error: 'Không thể tải video. Vui lòng thử lại.' })
        }
      })
    } else {
      update({ error: 'Trình duyệt không hỗ trợ HLS.' })
    }

    resetHideTimer()

    return () => {
      hlsRef.current?.destroy()
      hlsRef.current = null
      video.removeEventListener('timeupdate', onTimeUpdate)
      video.removeEventListener('durationchange', onDurationChange)
      video.removeEventListener('play', onPlay)
      video.removeEventListener('pause', onPause)
      video.removeEventListener('waiting', onWaiting)
      video.removeEventListener('canplay', onCanPlay)
      video.removeEventListener('volumechange', onVolumeChange)
      clearTimeout(hideTimerRef.current)
    }
  }, [src]) // eslint-disable-line react-hooks/exhaustive-deps

  // Keyboard shortcuts
  useEffect(() => {
    function onKey(e) {
      const v = videoRef.current
      if (!v || e.target.tagName === 'INPUT' || e.target.tagName === 'SELECT') return
      resetHideTimer()
      switch (e.key) {
        case ' ': case 'k': e.preventDefault(); v.paused ? v.play() : v.pause(); break
        case 'ArrowRight': e.preventDefault(); v.currentTime = Math.min(v.currentTime + 10, v.duration); break
        case 'ArrowLeft':  e.preventDefault(); v.currentTime = Math.max(v.currentTime - 10, 0); break
        case 'ArrowUp':    e.preventDefault(); v.volume = Math.min(v.volume + 0.1, 1); break
        case 'ArrowDown':  e.preventDefault(); v.volume = Math.max(v.volume - 0.1, 0); break
        case 'f': case 'F': toggleFullscreen(); break
        case 'm': case 'M': v.muted = !v.muted; break
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [resetHideTimer]) // eslint-disable-line react-hooks/exhaustive-deps

  function toggleFullscreen() {
    const el = containerRef.current
    if (!document.fullscreenElement) {
      el?.requestFullscreen().then(() => update({ isFullscreen: true })).catch(() => {})
    } else {
      document.exitFullscreen().then(() => update({ isFullscreen: false })).catch(() => {})
    }
  }

  function handleSeek(time) { if (videoRef.current) videoRef.current.currentTime = time }
  function handleTogglePlay() { const v = videoRef.current; v?.paused ? v.play() : v.pause() }
  function handleVolumeChange(val) { const v = videoRef.current; if (v) { v.volume = val; v.muted = val === 0 } }
  function handleToggleMute() { const v = videoRef.current; if (v) v.muted = !v.muted }
  function handleLevelChange(level) { if (hlsRef.current) { hlsRef.current.currentLevel = level; update({ currentLevel: level }) } }

  return (
    <div
      ref={containerRef}
      className="relative w-full bg-black overflow-hidden"
      style={{ aspectRatio: '16/9', cursor: state.controlsVisible ? 'default' : 'none' }}
      onMouseMove={resetHideTimer}
      onMouseLeave={() => { clearTimeout(hideTimerRef.current); update({ controlsVisible: false }) }}
      onClick={handleTogglePlay}
    >
      <video ref={videoRef} className="w-full h-full" playsInline />

      {state.isBuffering && !state.error && <SpinnerOverlay />}

      {state.error && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/80 gap-3">
          <p className="text-white text-sm">{state.error}</p>
          <button
            onClick={(e) => { e.stopPropagation(); update({ error: null, isBuffering: true }); hlsRef.current?.startLoad() }}
            className="px-4 py-2 text-sm font-medium rounded-sm"
            style={{ background: 'var(--primary)', color: 'var(--primary-btn-text)' }}
          >
            Thử lại
          </button>
        </div>
      )}

      {/* Title overlay (top) */}
      {title && (
        <div
          className="absolute top-0 left-0 right-0 px-4 pt-4 pb-8 transition-opacity duration-300"
          style={{
            opacity: state.controlsVisible ? 1 : 0,
            background: 'linear-gradient(to bottom, rgba(0,0,0,0.7) 0%, transparent 100%)',
          }}
        >
          <p className="text-white text-sm font-medium line-clamp-1">{title}</p>
        </div>
      )}

      <PlayerControls
        {...state}
        onTogglePlay={handleTogglePlay}
        onSeek={handleSeek}
        onVolumeChange={handleVolumeChange}
        onToggleMute={handleToggleMute}
        onLevelChange={handleLevelChange}
        onToggleFullscreen={toggleFullscreen}
        visible={state.controlsVisible}
      />
    </div>
  )
}
