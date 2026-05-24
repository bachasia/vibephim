function pad(n) { return String(Math.floor(n)).padStart(2, '0') }

function formatTime(secs) {
  if (!secs || isNaN(secs)) return '00:00'
  const h = Math.floor(secs / 3600)
  const m = Math.floor((secs % 3600) / 60)
  const s = Math.floor(secs % 60)
  return h > 0 ? `${h}:${pad(m)}:${pad(s)}` : `${pad(m)}:${pad(s)}`
}

// SVG icons
const PlayIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><polygon points="5,3 19,12 5,21" /></svg>
)
const PauseIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><rect x="6" y="4" width="4" height="16" /><rect x="14" y="4" width="4" height="16" /></svg>
)
const VolumeIcon = ({ muted, level }) => {
  if (muted || level === 0) return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><polygon points="11,5 6,9 2,9 2,15 6,15 11,19" /><line x1="23" y1="9" x2="17" y2="15" /><line x1="17" y1="9" x2="23" y2="15" /></svg>
  )
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><polygon points="11,5 6,9 2,9 2,15 6,15 11,19" /><path d="M15.54 8.46a5 5 0 0 1 0 7.07" />{level > 0.5 && <path d="M19.07 4.93a10 10 0 0 1 0 14.14" />}</svg>
  )
}
const FullscreenIcon = ({ active }) => active
  ? <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M8 3v3a2 2 0 0 1-2 2H3m18 0h-3a2 2 0 0 1-2-2V3m0 18v-3a2 2 0 0 0 2-2h3M3 16h3a2 2 0 0 0 2 2v3" /></svg>
  : <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3" /></svg>

export default function PlayerControls({
  playing, onTogglePlay,
  currentTime, duration, buffered, onSeek,
  volume, muted, onVolumeChange, onToggleMute,
  levels, currentLevel, onLevelChange,
  isFullscreen, onToggleFullscreen,
  visible,
}) {
  const progress = duration > 0 ? (currentTime / duration) * 100 : 0
  const bufferPct = duration > 0 ? (buffered / duration) * 100 : 0

  return (
    <div
      className="absolute bottom-0 left-0 right-0 transition-opacity duration-300 select-none"
      style={{ opacity: visible ? 1 : 0, pointerEvents: visible ? 'auto' : 'none' }}
    >
      {/* Gradient backdrop */}
      <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.85) 0%, transparent 100%)' }} />

      <div className="relative px-4 pb-3 pt-8">
        {/* Seek bar */}
        <div className="relative h-1 mb-3 group/seek cursor-pointer rounded-full overflow-hidden bg-white/20"
          onClick={(e) => {
            const rect = e.currentTarget.getBoundingClientRect()
            onSeek(((e.clientX - rect.left) / rect.width) * duration)
          }}
        >
          {/* Buffer fill */}
          <div className="absolute inset-y-0 left-0 bg-white/30 rounded-full transition-all" style={{ width: `${bufferPct}%` }} />
          {/* Progress fill */}
          <div className="absolute inset-y-0 left-0 rounded-full transition-all" style={{ width: `${progress}%`, background: '#e50914' }} />
        </div>

        {/* Controls row */}
        <div className="flex items-center gap-3">
          {/* Play/Pause */}
          <button onClick={onTogglePlay} className="text-white hover:text-zinc-300 transition-colors p-1" aria-label={playing ? 'Tạm dừng' : 'Phát'}>
            {playing ? <PauseIcon /> : <PlayIcon />}
          </button>

          {/* Time */}
          <span className="text-white text-xs tabular-nums">
            {formatTime(currentTime)} / {formatTime(duration)}
          </span>

          <div className="flex-1" />

          {/* Volume */}
          <div className="flex items-center gap-1.5 group/vol">
            <button onClick={onToggleMute} className="text-white hover:text-zinc-300 transition-colors p-1" aria-label={muted ? 'Bật tiếng' : 'Tắt tiếng'}>
              <VolumeIcon muted={muted} level={volume} />
            </button>
            <input
              type="range" min="0" max="1" step="0.05" value={muted ? 0 : volume}
              onChange={(e) => onVolumeChange(parseFloat(e.target.value))}
              className="w-0 group-hover/vol:w-20 overflow-hidden transition-all duration-200 accent-white h-1 cursor-pointer"
              aria-label="Âm lượng"
            />
          </div>

          {/* Quality selector */}
          {levels.length > 1 && (
            <select
              value={currentLevel}
              onChange={(e) => onLevelChange(parseInt(e.target.value))}
              className="text-white bg-transparent text-xs border border-white/30 rounded-sm px-1 py-0.5 cursor-pointer outline-none"
              aria-label="Chất lượng"
            >
              <option value={-1}>Auto</option>
              {levels.map((l, i) => (
                <option key={i} value={i}>{l.height ? `${l.height}p` : `Level ${i + 1}`}</option>
              ))}
            </select>
          )}

          {/* Fullscreen */}
          <button onClick={onToggleFullscreen} className="text-white hover:text-zinc-300 transition-colors p-1" aria-label="Toàn màn hình">
            <FullscreenIcon active={isFullscreen} />
          </button>
        </div>
      </div>
    </div>
  )
}
