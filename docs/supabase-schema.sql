-- Run this in Supabase SQL Editor (Dashboard → SQL Editor → New Query)

-- favorites table
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

-- watch_history table
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
