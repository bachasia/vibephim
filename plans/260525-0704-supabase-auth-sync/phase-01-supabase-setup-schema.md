---
phase: 1
title: "Supabase Setup & Schema"
status: pending
priority: P1
effort: "1h"
dependencies: []
---

# Phase 1: Supabase Setup & Schema

## Overview
Tạo Supabase project, thiết kế DB schema cho favorites + watch_history, bật RLS, lấy credentials để dùng ở phase 2.

## Requirements
- Functional: 2 tables với RLS, user chỉ truy cập data của mình
- Non-functional: Schema nhỏ gọn, index trên user_id + slug

## Architecture

```
Supabase Project
├── Auth (built-in, email/password)
├── Database
│   ├── public.favorites
│   └── public.watch_history
└── RLS policies (SELECT/INSERT/UPDATE/DELETE per user)
```

## SQL Schema

```sql
-- favorites
create table public.favorites (
  id         uuid primary key default gen_random_uuid(),
  user_id    uuid not null references auth.users(id) on delete cascade,
  slug       text not null,
  name       text,
  thumb_url  text,
  year       text,
  added_at   timestamptz default now(),
  unique(user_id, slug)
);
create index on public.favorites(user_id);

alter table public.favorites enable row level security;
create policy "user owns favorites" on public.favorites
  for all using (auth.uid() = user_id);

-- watch_history
create table public.watch_history (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid not null references auth.users(id) on delete cascade,
  slug        text not null,
  episode     text,
  progress    float,
  duration    float,
  name        text,
  thumb_url   text,
  watched_at  timestamptz default now(),
  unique(user_id, slug, episode)
);
create index on public.watch_history(user_id);

alter table public.watch_history enable row level security;
create policy "user owns history" on public.watch_history
  for all using (auth.uid() = user_id);
```

## Implementation Steps
1. Tạo tài khoản Supabase (supabase.com) → New project
2. Chạy SQL schema trong SQL Editor
3. Settings → API → copy `Project URL` và `anon public key`
4. Tạo `.env` file:
   ```
   VITE_SUPABASE_URL=https://xxx.supabase.co
   VITE_SUPABASE_ANON_KEY=eyJ...
   ```
5. Thêm `.env` vào `.gitignore` (nếu chưa có)
6. Thêm env vars vào Cloudflare Pages dashboard (Settings → Environment Variables)

## Success Criteria
- [ ] Supabase project tạo thành công
- [ ] Cả 2 tables tồn tại với RLS enabled
- [ ] `.env` có đủ 2 biến, không commit lên git
- [ ] Cloudflare Pages có env vars

## Risk Assessment
**RLS bị tắt**: User nào cũng đọc được data của người khác → MUST enable RLS trước khi deploy
