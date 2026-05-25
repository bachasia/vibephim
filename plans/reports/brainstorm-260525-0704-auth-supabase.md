# Brainstorm: Auth + Sync History/Favorites

## Problem
History và Favorites hiện lưu localStorage → mất khi đổi thiết bị, clear cache. Cần login để sync data.

## Constraints
- Deployed Cloudflare Pages (static, no server runtime)
- Guest mode phải giữ nguyên (không breaking)
- Simple: chỉ email + password

## Decision: Supabase

**Rejected:** Cloudflare Workers + D1 — over-engineered, cần viết JWT + API từ đầu

**Chosen:** Supabase
- Free tier 500MB / 50k MAU
- Auth + DB trong 1 service, client SDK thuần frontend
- RLS bảo vệ data per-user tự động
- Không cần backend

## Architecture

```
CF Pages (React)
  AuthContext (Supabase client)
  FavoritesContext → guest: localStorage | logged-in: Supabase
  WatchHistoryContext → guest: localStorage | logged-in: Supabase
```

## DB Schema (Supabase)

```sql
-- favorites (user_id FK auth.users)
id, user_id, slug, name, thumb_url, year, added_at

-- watch_history
id, user_id, slug, episode, progress, duration, name, thumb_url, watched_at
```

RLS: user chỉ đọc/ghi row của mình.

## Implementation Phases
1. Setup Supabase project + schema + RLS
2. AuthContext + login/register modal
3. FavoritesContext dual-mode (localStorage vs Supabase)
4. WatchHistoryContext dual-mode
5. Header: avatar + logout
6. Merge localStorage → Supabase khi login lần đầu (optional prompt)
