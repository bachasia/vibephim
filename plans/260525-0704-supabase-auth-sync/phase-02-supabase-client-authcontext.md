---
phase: 2
title: "Supabase Client & AuthContext"
status: completed
priority: P1
effort: "1h"
dependencies: [1]
---

# Phase 2: Supabase Client & AuthContext

## Overview
Cài `@supabase/supabase-js`, tạo singleton client, và `AuthContext` cung cấp `user`, `signIn`, `signUp`, `signOut` cho toàn app.

## Requirements
- Functional: Auth state persist qua page reload (Supabase tự handle via localStorage session)
- Non-functional: Client khởi tạo 1 lần, không leak

## Architecture

```
src/
├── services/supabase-client.js   ← singleton createClient()
└── contexts/auth-context.jsx     ← AuthContext + AuthProvider
```

## Related Code Files
- Create: `src/services/supabase-client.js`
- Create: `src/contexts/auth-context.jsx`
- Modify: `src/main.jsx` — wrap với `<AuthProvider>`

## Implementation Steps

### 1. Cài package
```bash
npm install @supabase/supabase-js
```

### 2. `src/services/supabase-client.js`
```js
import { createClient } from '@supabase/supabase-js'

export const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
)
```

### 3. `src/contexts/auth-context.jsx`
```jsx
import { createContext, useContext, useState, useEffect } from 'react'
import { supabase } from '../services/supabase-client.js'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null)
      setLoading(false)
    })
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_e, session) => {
      setUser(session?.user ?? null)
    })
    return () => subscription.unsubscribe()
  }, [])

  const signIn = (email, password) =>
    supabase.auth.signInWithPassword({ email, password })

  const signUp = (email, password) =>
    supabase.auth.signUp({ email, password })

  const signOut = () => supabase.auth.signOut()

  return (
    <AuthContext.Provider value={{ user, loading, signIn, signUp, signOut }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
```

### 4. Wrap trong `main.jsx`
```jsx
<AuthProvider>
  <FavoritesProvider>
    <WatchHistoryProvider>
      ...
    </WatchHistoryProvider>
  </FavoritesProvider>
</AuthProvider>
```
`AuthProvider` phải bọc ngoài cùng vì FavoritesContext/WatchHistoryContext cần `useAuth`.

## Success Criteria
- [ ] `npm install` thành công
- [ ] `supabase` client export không lỗi
- [ ] `useAuth()` trả về `{ user: null, loading: false }` khi chưa login
- [ ] Sau khi login, `user` có `id` và `email`
- [ ] Reload page vẫn giữ session

## Risk Assessment
- `VITE_SUPABASE_URL` undefined → client throw → check `.env` và Vite env prefix
