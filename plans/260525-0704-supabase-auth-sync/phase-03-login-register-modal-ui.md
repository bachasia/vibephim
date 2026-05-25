---
phase: 3
title: "Login/Register Modal UI"
status: completed
priority: P1
effort: "2h"
dependencies: [2]
---

# Phase 3: Login/Register Modal UI

## Overview
Modal đơn giản có 2 tab (Đăng nhập / Đăng ký), form email+password, xử lý error, mở từ header button.

## Requirements
- Functional: Sign in, sign up, hiện error message, close on success
- Non-functional: Không dùng library form, code tối thiểu, accessible

## Architecture

```
src/components/auth/
└── auth-modal.jsx    ← Modal + form, dùng useAuth()
```

Header button → mở modal qua state hoặc context.

## Related Code Files
- Create: `src/components/auth/auth-modal.jsx`
- Modify: `src/components/layout/header.jsx` — thêm "Đăng nhập" button + modal state

## Implementation Steps

### `src/components/auth/auth-modal.jsx`
```jsx
import { useState } from 'react'
import { useAuth } from '../../contexts/auth-context.jsx'

export default function AuthModal({ onClose }) {
  const { signIn, signUp } = useAuth()
  const [tab, setTab] = useState('login')   // 'login' | 'register'
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    setLoading(true)
    const fn = tab === 'login' ? signIn : signUp
    const { error: err } = await fn(email, password)
    setLoading(false)
    if (err) { setError(err.message); return }
    onClose()
  }

  // Backdrop + modal container (Escape to close)
  // Tab bar: Đăng nhập / Đăng ký
  // email input, password input
  // error text
  // submit button (disabled when loading)
  // close X button top-right
}
```

### Thêm vào `header.jsx`
- State `authOpen` boolean
- Khi chưa login: hiện button "Đăng nhập" → set `authOpen = true`
- Render `{authOpen && <AuthModal onClose={() => setAuthOpen(false)} />}`

## UI Spec

```
┌─────────────────────────────┐
│  [Đăng nhập] [Đăng ký]   ✕ │
├─────────────────────────────┤
│  Email                      │
│  ┌─────────────────────┐   │
│  └─────────────────────┘   │
│  Mật khẩu                  │
│  ┌─────────────────────┐   │
│  └─────────────────────┘   │
│  ⚠ error message           │
│  [     Đăng nhập     ]     │
└─────────────────────────────┘
```

Style: dùng CSS vars đã có (`--bg-2`, `--bg-3`, `--primary`, `--border-color`). Backdrop blur. Escape + backdrop click để close.

## Success Criteria
- [ ] Login với email/password đúng → modal close, user set
- [ ] Login sai → hiện error message
- [ ] Register → Supabase gửi confirmation email (hoặc auto-confirm nếu tắt email confirm)
- [ ] Escape + backdrop click đóng modal
- [ ] Mobile: modal full-width với mx-4

## Risk Assessment
- Supabase mặc định yêu cầu email confirmation → disable trong Supabase dashboard (Authentication → Settings → Disable email confirmation) cho dev/personal use
