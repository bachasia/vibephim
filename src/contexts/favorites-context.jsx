import { createContext, useContext, useState, useEffect, useMemo, useCallback } from 'react'
import { useAuth } from './auth-context.jsx'
import { supabase } from '../services/supabase-client.js'

const FavoritesContext = createContext(null)

function loadFromStorage(key, fallback) {
  try { return JSON.parse(localStorage.getItem(key) || 'null') ?? fallback }
  catch { return fallback }
}

export function FavoritesProvider({ children }) {
  const { user } = useAuth()
  const [favorites, setFavorites] = useState(() => loadFromStorage('vibephim_favorites', []))

  // Load from Supabase when user logs in
  useEffect(() => {
    if (!user) return
    supabase
      .from('favorites')
      .select('slug, name, thumb_url, year, added_at')
      .order('added_at', { ascending: false })
      .then(({ data, error }) => {
        if (!error && data) setFavorites(data)
      })
  }, [user?.id])

  // Reset to localStorage when user logs out — use user?.id to avoid spurious resets on token refresh
  useEffect(() => {
    if (!user?.id) setFavorites(loadFromStorage('vibephim_favorites', []))
  }, [user?.id])

  // Sync to localStorage only in guest mode
  useEffect(() => {
    if (!user) localStorage.setItem('vibephim_favorites', JSON.stringify(favorites))
  }, [favorites, user])

  const addFavorite = useCallback(async (movie) => {
    const entry = { slug: movie.slug, name: movie.name, thumb_url: movie.thumb_url, year: movie.year }
    const optimistic = { ...entry, addedAt: Date.now() }
    setFavorites((prev) => {
      if (prev.some((m) => m.slug === movie.slug)) return prev
      return [optimistic, ...prev].slice(0, 200)
    })
    if (user) {
      const { error } = await supabase.from('favorites').upsert({ user_id: user.id, ...entry })
      if (error) setFavorites((prev) => prev.filter((m) => m.slug !== movie.slug))
    }
  }, [user])

  const removeFavorite = useCallback(async (slug) => {
    setFavorites((prev) => prev.filter((m) => m.slug !== slug))
    if (user) {
      const { error } = await supabase.from('favorites').delete().eq('user_id', user.id).eq('slug', slug)
      if (error) {
        // Rollback: re-fetch from Supabase to restore correct state
        supabase.from('favorites').select('slug, name, thumb_url, year, added_at')
          .order('added_at', { ascending: false })
          .then(({ data }) => { if (data) setFavorites(data) })
      }
    }
  }, [user])

  const mergeLocalToCloud = useCallback(async () => {
    const local = loadFromStorage('vibephim_favorites', [])
    if (!local.length || !user) return
    const rows = local.map((f) => ({ user_id: user.id, slug: f.slug, name: f.name, thumb_url: f.thumb_url, year: f.year }))
    await supabase.from('favorites').upsert(rows, { onConflict: 'user_id,slug' })
    const { data } = await supabase.from('favorites').select('slug, name, thumb_url, year, added_at').order('added_at', { ascending: false })
    if (data) setFavorites(data)
  }, [user])

  const value = useMemo(() => ({
    favorites,
    isFavorite: (slug) => favorites.some((m) => m.slug === slug),
    addFavorite,
    removeFavorite,
    mergeLocalToCloud,
  }), [favorites, addFavorite, removeFavorite, mergeLocalToCloud])

  return <FavoritesContext.Provider value={value}>{children}</FavoritesContext.Provider>
}

export function useFavorites() {
  const ctx = useContext(FavoritesContext)
  if (!ctx) throw new Error('useFavorites must be used within FavoritesProvider')
  return ctx
}
