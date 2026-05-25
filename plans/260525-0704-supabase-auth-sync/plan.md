---
title: "Supabase Auth + Sync Favorites & History"
description: "Add email/password auth via Supabase. Favorites and watch history sync to cloud when logged in; fall back to localStorage for guests."
status: pending
priority: P2
branch: "main"
tags: [auth, supabase, sync, favorites, history]
blockedBy: []
blocks: []
created: "2026-05-25T00:09:11.563Z"
createdBy: "ck:plan"
source: skill
---

# Supabase Auth + Sync Favorites & History

## Overview

Thêm đăng ký / đăng nhập email+password bằng Supabase. Khi đã login, favorites và lịch sử xem được sync lên Supabase (cross-device). Khi chưa login, giữ nguyên localStorage (guest mode, zero breaking change).

**Brainstorm:** [brainstorm-260525-0704-auth-supabase.md](../reports/brainstorm-260525-0704-auth-supabase.md)

## Stack

| Concern | Solution |
|---------|----------|
| Auth | Supabase built-in (email/password) |
| DB | Supabase PostgreSQL (favorites + watch_history) |
| Security | Row Level Security — user chỉ đọc/ghi data của mình |
| Frontend | `@supabase/supabase-js` client SDK |
| Deploy | Cloudflare Pages + env vars |

## Phases

| Phase | Name | Status | Effort |
|-------|------|--------|--------|
| 1 | [Supabase Setup & Schema](./phase-01-supabase-setup-schema.md) | Pending | 1h |
| 2 | [Supabase Client & AuthContext](./phase-02-supabase-client-authcontext.md) | Pending | 1h |
| 3 | [Login/Register Modal UI](./phase-03-login-register-modal-ui.md) | Pending | 2h |
| 4 | [FavoritesContext Dual-mode](./phase-04-favoritescontext-dual-mode.md) | Pending | 1.5h |
| 5 | [WatchHistoryContext Dual-mode](./phase-05-watchhistorycontext-dual-mode.md) | Pending | 1.5h |
| 6 | [Header User Menu & Data Migration](./phase-06-header-user-menu-data-migration.md) | Pending | 1h |

**Total:** ~8h

## Key Files

```
src/
├── services/supabase-client.js       ← NEW: singleton client
├── contexts/auth-context.jsx         ← NEW: user, signIn, signUp, signOut
├── components/auth/auth-modal.jsx    ← NEW: login/register modal
├── contexts/favorites-context.jsx    ← MODIFY: dual-mode
├── contexts/watch-history-context.jsx ← MODIFY: dual-mode
└── components/layout/header.jsx     ← MODIFY: avatar + auth button
```

## Dependencies

Phase 2, 3, 4, 5 đều phụ thuộc phase 1 (cần credentials).
Phase 3, 4, 5 đều phụ thuộc phase 2 (cần AuthContext).
Phase 6 phụ thuộc 3+4+5.
