import { createContext, useContext, useState, useEffect, useMemo, useCallback } from 'react'
import { useAuth } from './auth-context.jsx'
import { supabase } from '../services/supabase-client.js'

const WatchHistoryContext = createContext(null)

function loadFromStorage(key, fallback) {
  try { return JSON.parse(localStorage.getItem(key) || 'null') ?? fallback }
  catch { return fallback }
}

export function WatchHistoryProvider({ children }) {
  const { user } = useAuth()
  const [history, setHistory] = useState(() => loadFromStorage('vibephim_history', []))

  // Load from Supabase when user logs in
  useEffect(() => {
    if (!user) return
    supabase
      .from('watch_history')
      .select('slug, episode, progress, duration, name, thumb_url, watched_at')
      .order('watched_at', { ascending: false })
      .limit(100)
      .then(({ data, error }) => {
        if (!error && data) setHistory(data)
      })
  }, [user?.id])

  // Reset to localStorage when user logs out — use user?.id to avoid spurious resets on token refresh
  useEffect(() => {
    if (!user?.id) setHistory(loadFromStorage('vibephim_history', []))
  }, [user?.id])

  // Sync to localStorage only in guest mode
  useEffect(() => {
    if (!user) localStorage.setItem('vibephim_history', JSON.stringify(history))
  }, [history, user])

  const addToHistory = useCallback(async (entry) => {
    const record = { ...entry, watchedAt: Date.now() }
    setHistory((prev) => {
      const filtered = prev.filter((h) => !(h.slug === entry.slug && h.episode === entry.episode))
      return [record, ...filtered].slice(0, 100)
    })
    if (user) {
      await supabase.from('watch_history').upsert({
        user_id: user.id,
        slug: entry.slug,
        episode: entry.episode,
        progress: entry.progress,
        duration: entry.duration ?? null,
        name: entry.name,
        thumb_url: entry.thumb_url,
        watched_at: new Date().toISOString(),
      })
      // upsert failures are non-critical for progress tracking — silently tolerate
    }
  }, [user])

  const clearHistory = useCallback(async () => {
    setHistory([])
    if (user) {
      await supabase.from('watch_history').delete().eq('user_id', user.id)
    } else {
      localStorage.removeItem('vibephim_history')
    }
  }, [user])

  const mergeLocalToCloud = useCallback(async () => {
    const local = loadFromStorage('vibephim_history', [])
    if (!local.length || !user) return
    const rows = local.map((h) => ({
      user_id: user.id,
      slug: h.slug,
      episode: h.episode,
      progress: h.progress,
      duration: h.duration ?? null,
      name: h.name,
      thumb_url: h.thumb_url,
      watched_at: h.watchedAt ? new Date(h.watchedAt).toISOString() : new Date().toISOString(),
    }))
    await supabase.from('watch_history').upsert(rows, { onConflict: 'user_id,slug,episode' })
    const { data } = await supabase
      .from('watch_history')
      .select('slug, episode, progress, duration, name, thumb_url, watched_at')
      .order('watched_at', { ascending: false })
      .limit(100)
    if (data) setHistory(data)
  }, [user])

  const value = useMemo(() => ({
    history,
    getProgress: (slug, ep) => history.find((h) => h.slug === slug && h.episode === ep)?.progress ?? 0,
    addToHistory,
    clearHistory,
    mergeLocalToCloud,
  }), [history, addToHistory, clearHistory, mergeLocalToCloud])

  return <WatchHistoryContext.Provider value={value}>{children}</WatchHistoryContext.Provider>
}

export function useWatchHistory() {
  const ctx = useContext(WatchHistoryContext)
  if (!ctx) throw new Error('useWatchHistory must be used within WatchHistoryProvider')
  return ctx
}
