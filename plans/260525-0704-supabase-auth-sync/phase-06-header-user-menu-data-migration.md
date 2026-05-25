---
phase: 6
title: "Header User Menu & Data Migration"
status: completed
priority: P2
effort: "1h"
dependencies: [3, 4, 5]
---

# Phase 6: Header User Menu & Data Migration

## Overview
Hiển thị avatar + email + logout button trên header khi đã login. Hỏi user có muốn merge localStorage data lên Supabase khi login lần đầu.

## Related Code Files
- Modify: `src/components/layout/header.jsx`
- Modify: `src/contexts/favorites-context.jsx` — thêm `mergeLocalToCloud()`
- Modify: `src/contexts/watch-history-context.jsx` — thêm `mergeLocalToCloud()`

## Implementation Steps

### 1. Header user menu

```jsx
// Trong header.jsx
const { user, signOut } = useAuth()

// Khi đã login
{user && (
  <div className="relative group">
    {/* Avatar: chữ cái đầu email */}
    <button className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold"
      style={{ background: 'var(--primary)', color: 'var(--primary-btn-text)' }}>
      {user.email[0].toUpperCase()}
    </button>
    {/* Dropdown on hover/click */}
    <div className="absolute right-0 top-full mt-1 hidden group-hover:block ...">
      <p className="text-xs px-3 py-2" style={{ color: 'var(--text-muted)' }}>{user.email}</p>
      <button onClick={signOut} className="...">Đăng xuất</button>
    </div>
  </div>
)}

// Khi chưa login
{!user && (
  <button onClick={() => setAuthOpen(true)} className="...">Đăng nhập</button>
)}
```

### 2. Data migration prompt

Khi `onAuthStateChange` fires với event `SIGNED_IN` lần đầu, kiểm tra localStorage có data không. Nếu có → hiện toast/confirm:

```jsx
// Trong AuthContext hoặc App.jsx
supabase.auth.onAuthStateChange((event, session) => {
  if (event === 'SIGNED_IN') {
    const localFavs = JSON.parse(localStorage.getItem('vibephim_favorites') || '[]')
    const localHistory = JSON.parse(localStorage.getItem('vibephim_history') || '[]')
    if (localFavs.length > 0 || localHistory.length > 0) {
      // Set flag để hiện migration prompt
      setShowMigrationPrompt(true)
    }
  }
})
```

Migration prompt UI (đơn giản):
```
┌────────────────────────────────┐
│ Bạn có X phim yêu thích và    │
│ Y lịch sử xem trên thiết bị   │
│ này. Đồng bộ lên tài khoản?   │
│                                │
│ [Đồng bộ]  [Bỏ qua]          │
└────────────────────────────────┘
```

### 3. `mergeLocalToCloud()` trong contexts

```js
// favorites-context
const mergeLocalToCloud = async () => {
  const local = loadFromStorage('vibephim_favorites', [])
  if (!local.length || !user) return
  const rows = local.map(f => ({ user_id: user.id, ...f }))
  await supabase.from('favorites').upsert(rows, { onConflict: 'user_id,slug' })
  // reload
  const { data } = await supabase.from('favorites').select('*').order('added_at', { ascending: false })
  if (data) setFavorites(data)
}
```

## Success Criteria
- [ ] Header hiện avatar + email khi đã login
- [ ] Logout button hoạt động, user cleared
- [ ] Khi login lần đầu có localStorage data → hiện migration prompt
- [ ] Chọn "Đồng bộ" → data merge lên Supabase, không duplicate
- [ ] Chọn "Bỏ qua" → không sync, dismiss prompt

## Risk Assessment
- Migration chạy 2 lần nếu user logout/login lại → check bằng `localStorage.getItem('vibephim_migrated_<userId>')` flag sau khi merge thành công
