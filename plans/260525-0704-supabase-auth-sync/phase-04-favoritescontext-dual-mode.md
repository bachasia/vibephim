---
phase: 4
title: "FavoritesContext Dual-mode"
status: pending
priority: P1
effort: "1.5h"
dependencies: [2]
---

# Phase 4: FavoritesContext Dual-mode

## Overview
Sửa `FavoritesContext` để khi logged-in thì đọc/ghi Supabase, khi guest thì giữ nguyên localStorage. Không thay đổi API (`isFavorite`, `addFavorite`, `removeFavorite`).

## Architecture

```
FavoritesContext
  user == null → localStorage (current behavior, unchanged)
  user != null → Supabase public.favorites
```

## Related Code Files
- Modify: `src/contexts/favorites-context.jsx`

## Implementation Steps

### Pattern

```jsx
import { useAuth } from './auth-context.jsx'
import { supabase } from '../services/supabase-client.js'

export function FavoritesProvider({ children }) {
  const { user } = useAuth()
  const [favorites, setFavorites] = useState(() => loadFromStorage('vibephim_favorites', []))

  // Khi user login → load từ Supabase
  useEffect(() => {
    if (!user) return
    supabase
      .from('favorites')
      .select('slug, name, thumb_url, year, added_at')
      .order('added_at', { ascending: false })
      .then(({ data }) => { if (data) setFavorites(data) })
  }, [user?.id])

  // Khi user logout → reset về localStorage
  useEffect(() => {
    if (!user) setFavorites(loadFromStorage('vibephim_favorites', []))
  }, [user])

  const addFavorite = async (movie) => {
    const entry = { slug: movie.slug, name: movie.name, thumb_url: movie.thumb_url, year: movie.year }
    if (user) {
      await supabase.from('favorites').upsert({ user_id: user.id, ...entry })
    } else {
      localStorage.setItem('vibephim_favorites', JSON.stringify(
        [{ ...entry, addedAt: Date.now() }, ...favorites.filter(m => m.slug !== movie.slug)].slice(0, 200)
      ))
    }
    setFavorites(prev => [entry, ...prev.filter(m => m.slug !== movie.slug)])
  }

  const removeFavorite = async (slug) => {
    if (user) {
      await supabase.from('favorites').delete().eq('user_id', user.id).eq('slug', slug)
    } else {
      localStorage.setItem('vibephim_favorites', JSON.stringify(favorites.filter(m => m.slug !== slug)))
    }
    setFavorites(prev => prev.filter(m => m.slug !== slug))
  }

  // isFavorite không thay đổi
  // localStorage sync effect chỉ chạy khi user == null
}
```

### Lưu ý
- Bỏ `useEffect` sync localStorage khi `user != null` để tránh ghi đè
- Optimistic update: cập nhật state ngay, Supabase call async (không await trong render)
- `useEffect` dependency là `user?.id` để tránh infinite re-render

## Success Criteria
- [ ] Guest: favorites lưu/đọc localStorage như cũ
- [ ] Logged-in: add/remove ghi lên Supabase, reload lại vẫn còn
- [ ] Logout: state reset về localStorage data
- [ ] Không thay đổi interface `isFavorite`/`addFavorite`/`removeFavorite`

## Risk Assessment
- Race condition nếu user vừa login vừa add favorite → `useEffect` load Supabase đè state → dùng `user?.id` dep thay vì `user`
