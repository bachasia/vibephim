const AVATAR_COLORS = [
  '#c0392b', '#8e44ad', '#2980b9', '#16a085', '#d35400',
  '#27ae60', '#2c3e50', '#7f8c8d', '#6c3483', '#1a5276',
]

function avatarColor(name) {
  let h = 0
  for (let i = 0; i < name.length; i++) h = (h * 31 + name.charCodeAt(i)) & 0xffffffff
  return AVATAR_COLORS[Math.abs(h) % AVATAR_COLORS.length]
}

function lastInitial(name) {
  const parts = name.trim().split(/\s+/)
  return parts[parts.length - 1][0].toUpperCase()
}

export default function CastSection({ actors = [] }) {
  const filtered = actors.filter(a => a && a !== 'Đang cập nhật')
  if (!filtered.length) return null

  return (
    <div className="mt-6">
      <h2 className="text-sm font-bold text-white mb-3 uppercase tracking-wide">Diễn viên</h2>
      <div style={{ borderTop: '1px solid rgba(255,255,255,0.08)', marginBottom: '14px' }} />
      <div className="grid grid-cols-3 gap-x-2 gap-y-4">
        {filtered.map((name) => (
          <div key={name} className="flex flex-col items-center gap-1.5">
            <div
              className="flex items-center justify-center rounded-full font-bold text-lg text-white shrink-0"
              style={{ width: '52px', height: '52px', background: avatarColor(name) }}
            >
              {lastInitial(name)}
            </div>
            <span
              className="text-[11px] text-center leading-tight w-full"
              style={{ color: '#d4d4d4' }}
            >
              {name}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}
