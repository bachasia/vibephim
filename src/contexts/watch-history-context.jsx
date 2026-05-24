import { createContext, useContext, useState, useEffect, useMemo } from 'react'

const WatchHistoryContext = createContext(null)

function loadFromStorage(key, fallback) {
  try { return JSON.parse(localStorage.getItem(key) || 'null') ?? fallback }
  catch { return fallback }
}

export function WatchHistoryProvider({ children }) {
  const [history, setHistory] = useState(() => loadFromStorage('vibephim_history', []))

  useEffect(() => {
    localStorage.setItem('vibephim_history', JSON.stringify(history))
  }, [history])

  const value = useMemo(() => ({
    history,
    getProgress: (slug, ep) => history.find((h) => h.slug === slug && h.episode === ep)?.progress ?? 0,
    addToHistory: (entry) => setHistory((prev) => {
      const filtered = prev.filter((h) => !(h.slug === entry.slug && h.episode === entry.episode))
      return [{ ...entry, watchedAt: Date.now() }, ...filtered].slice(0, 100)
    }),
    clearHistory: () => setHistory([]),
  }), [history])

  return <WatchHistoryContext.Provider value={value}>{children}</WatchHistoryContext.Provider>
}

export function useWatchHistory() {
  const ctx = useContext(WatchHistoryContext)
  if (!ctx) throw new Error('useWatchHistory must be used within WatchHistoryProvider')
  return ctx
}
