---
phase: 5
title: "WatchHistoryContext Dual-mode"
status: pending
priority: P1
effort: "1.5h"
dependencies: [2]
---

# Phase 5: WatchHistoryContext Dual-mode

## Overview
Sửa `WatchHistoryContext` theo pattern tương tự phase 4: guest → localStorage, logged-in → Supabase. Không thay đổi API (`getProgress`, `addToHistory`, `clearHistory`).

## Architecture

```
WatchHistoryContext
  user == null → localStorage (current behavior)
  user != null → Supabase public.watch_history
```

## Related Code Files
- Modify: `src/contexts/watch-history-context.jsx`

## Implementation Steps

### Pattern

```jsx
import { useAuth } from './auth-context.jsx'
import { supabase } from '../services/supabase-client.js'

export function WatchHistoryProvider({ children }) {
  const { user } = useAuth()
  const [history, setHistory] = useState(() => loadFromStorage('vibephim_history', []))

  // Load từ Supabase khi login
  useEffect(() => {
    if (!user) return
    supabase
      .from('watch_history')
      .select('slug, episode, progress, duration, name, thumb_url, watched_at')
      .order('watched_at', { ascending: false })
      .limit(100)
      .then(({ data }) => { if (data) setHistory(data) })
  }, [user?.id])

  // Reset về localStorage khi logout
  useEffect(() => {
    if (!user) setHistory(loadFromStorage('vibephim_history', []))
  }, [user])

  const addToHistory = async (entry) => {
    const record = { ...entry, watchedAt: Date.now() }
    if (user) {
      await supabase.from('watch_history').upsert({
        user_id: user.id,
        slug: entry.slug,
        episode: entry.episode,
        progress: entry.progress,
        duration: entry.duration,
        name: entry.name,
        thumb_url: entry.thumb_url,
        watched_at: new Date().toISOString(),
      })
    }
    setHistory(prev => {
      const filtered = prev.filter(h => !(h.slug === entry.slug && h.episode === entry.episode))
      const next = [record, ...filtered].slice(0, 100)
      if (!user) localStorage.setItem('vibephim_history', JSON.stringify(next))
      return next
    })
  }

  const clearHistory = async () => {
    if (user) {
      await supabase.from('watch_history').delete().eq('user_id', user.id)
    } else {
      localStorage.removeItem('vibephim_history')
    }
    setHistory([])
  }

  const getProgress = (slug, ep) =>
    history.find(h => h.slug === slug && h.episode === ep)?.progress ?? 0

  // ...Provider
}
```

### Lưu ý
- `addToHistory` được gọi mỗi 5s trong watch-page → Supabase upsert là idempotent, không tạo duplicate (unique constraint `user_id + slug + episode`)
- `duration` field: hiện context không lưu duration → cần xem video-player có expose duration không (phase này có thể skip duration nếu chưa có)

## Success Criteria
- [ ] Guest: history lưu/đọc localStorage như cũ
- [ ] Logged-in: xem phim → progress ghi lên Supabase sau 5s
- [ ] Reload page: progress resume từ Supabase
- [ ] `clearHistory` xóa Supabase khi logged-in, localStorage khi guest
- [ ] Không thay đổi API của context

## Risk Assessment
- `duration` chưa có trong context hiện tại → upsert với `duration: null` vẫn ổn, skip field này hoặc thêm sau
- Nhiều upsert calls liên tiếp (mỗi 5s) → Supabase free tier cho phép, không lo throttle
