import { useState, useEffect } from 'react'
import { supabase } from '../../services/supabase-client.js'
import { useFavorites } from '../../contexts/favorites-context.jsx'
import { useWatchHistory } from '../../contexts/watch-history-context.jsx'

function getLocalCounts() {
  try {
    const favs = JSON.parse(localStorage.getItem('vibephim_favorites') || '[]')
    const hist = JSON.parse(localStorage.getItem('vibephim_history') || '[]')
    return { favs: favs.length, hist: hist.length }
  } catch {
    return { favs: 0, hist: 0 }
  }
}

export default function MigrationPrompt() {
  const { mergeLocalToCloud: mergeFavs } = useFavorites()
  const { mergeLocalToCloud: mergeHist } = useWatchHistory()
  const [pending, setPending] = useState(null) // { userId, favs, hist }
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event !== 'SIGNED_IN' || !session?.user) return
      const userId = session.user.id
      if (localStorage.getItem(`vibephim_migrated_${userId}`)) return
      const { favs, hist } = getLocalCounts()
      if (favs > 0 || hist > 0) setPending({ userId, favs, hist })
    })
    return () => subscription.unsubscribe()
  }, [])

  if (!pending) return null

  async function handleSync() {
    setLoading(true)
    await Promise.all([mergeFavs(), mergeHist()])
    localStorage.setItem(`vibephim_migrated_${pending.userId}`, '1')
    setLoading(false)
    setPending(null)
  }

  function handleSkip() {
    localStorage.setItem(`vibephim_migrated_${pending.userId}`, '1')
    setPending(null)
  }

  const parts = []
  if (pending.favs > 0) parts.push(`${pending.favs} phim yêu thích`)
  if (pending.hist > 0) parts.push(`${pending.hist} lịch sử xem`)

  return (
    <div
      className="fixed bottom-6 left-1/2 z-[110] w-full max-w-sm px-4"
      style={{ transform: 'translateX(-50%)' }}
    >
      <div
        className="rounded-xl p-4 shadow-lg"
        style={{ background: 'var(--bg-2)', border: '1px solid var(--border-color)' }}
      >
        <p className="text-sm mb-3" style={{ color: 'var(--text-base)' }}>
          Bạn có {parts.join(' và ')} trên thiết bị này. Đồng bộ lên tài khoản?
        </p>
        <div className="flex gap-2">
          <button
            onClick={handleSync}
            disabled={loading}
            className="flex-1 py-2 rounded-lg text-sm font-medium transition-opacity"
            style={{ background: 'var(--primary)', color: 'var(--primary-btn-text, #fff)', opacity: loading ? 0.6 : 1 }}
          >
            {loading ? 'Đang đồng bộ...' : 'Đồng bộ'}
          </button>
          <button
            onClick={handleSkip}
            disabled={loading}
            className="flex-1 py-2 rounded-lg text-sm font-medium"
            style={{ background: 'var(--bg-3)', color: 'var(--text-muted)' }}
          >
            Bỏ qua
          </button>
        </div>
      </div>
    </div>
  )
}
