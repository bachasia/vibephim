import { createContext, useContext, useState, useEffect, useMemo } from 'react'

const FavoritesContext = createContext(null)

function loadFromStorage(key, fallback) {
  try { return JSON.parse(localStorage.getItem(key) || 'null') ?? fallback }
  catch { return fallback }
}

export function FavoritesProvider({ children }) {
  const [favorites, setFavorites] = useState(() => loadFromStorage('vibephim_favorites', []))

  useEffect(() => {
    localStorage.setItem('vibephim_favorites', JSON.stringify(favorites))
  }, [favorites])

  const value = useMemo(() => ({
    favorites,
    isFavorite: (slug) => favorites.some((m) => m.slug === slug),
    addFavorite: (movie) => setFavorites((prev) => {
      if (prev.some((m) => m.slug === movie.slug)) return prev
      const entry = { slug: movie.slug, name: movie.name, thumb_url: movie.thumb_url, year: movie.year, addedAt: Date.now() }
      return [entry, ...prev].slice(0, 200)
    }),
    removeFavorite: (slug) => setFavorites((prev) => prev.filter((m) => m.slug !== slug)),
  }), [favorites])

  return <FavoritesContext.Provider value={value}>{children}</FavoritesContext.Provider>
}

export function useFavorites() {
  const ctx = useContext(FavoritesContext)
  if (!ctx) throw new Error('useFavorites must be used within FavoritesProvider')
  return ctx
}
