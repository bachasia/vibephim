---
phase: 6
title: "Polish & Responsive"
status: pending
priority: P2
effort: "1-2h"
dependencies: [4, 5]
---

# Phase 6: Polish & Responsive

## Overview

Final polish pass: responsive layout across all breakpoints, error boundaries, loading states, performance optimizations, and deployment setup.

## Requirements

- Functional: All pages work on mobile/tablet/desktop, error states handled gracefully, 404 page
- Non-functional: Fast initial load, smooth animations, accessible navigation

## Related Code Files

- Modify: all page and component files (responsive tweaks)
- Create: `src/pages/not-found-page.jsx`
- Create: `src/components/ui/error-boundary.jsx`
- Create: `src/components/ui/scroll-to-top.jsx`
- Modify: `src/App.jsx` (error boundary, scroll restoration, 404 route)
- Modify: `vite.config.js` (build optimizations)
- Create: `public/_redirects` or `vercel.json` (SPA routing)

## Implementation Steps

1. **Responsive audit** — test all pages at breakpoints:
   - Mobile: 375px (iPhone SE), 390px (iPhone 14)
   - Tablet: 768px
   - Desktop: 1024px, 1280px, 1440px
   - Fix: header mobile menu (hamburger), carousel touch scroll, player controls sizing, grid column counts

2. **Mobile header** — hamburger menu for nav links:
   - Slide-in sidebar or dropdown on mobile
   - Close on route change

3. **Error boundary** — `error-boundary.jsx`:
   - Catch render errors, show fallback UI
   - "Something went wrong" + retry button
   - Wrap main content in App.jsx

4. **404 page** — `not-found-page.jsx`:
   - Fun design: "Phim không tồn tại"
   - Link back to home
   - Add `*` catch-all route in App.jsx

5. **Scroll to top** — `scroll-to-top.jsx`:
   - On route change → `window.scrollTo(0, 0)`
   - Place inside Router

6. **Loading improvements**:
   - Page-level loading states (full skeleton)
   - Image placeholder with blur-up effect (optional)
   - Smooth transitions between pages

7. **Performance**:
   - `React.lazy()` + `Suspense` for page-level code splitting
   - Image: `loading="lazy"` on all `<img>` tags (already done)
   - Debounce scroll events in carousels
   - Memoize expensive components with `React.memo`

8. **Animations** — subtle Tailwind transitions:
   - Page fade-in: `animate-fadeIn` custom animation
   - Card hover: `transition-transform duration-300 hover:scale-105`
   - Controls fade: `transition-opacity`

9. **SEO / Meta** — basic `<title>` updates per page:
   - Use `document.title` in `useEffect` per page
   - Home: "VibPhim - Xem Phim Online"
   - Detail: "{movie.name} - VibPhim"

10. **Deploy config**:
    - Vercel: `vercel.json` with SPA rewrites `{ "rewrites": [{ "source": "/(.*)", "destination": "/index.html" }] }`
    - Or Netlify: `public/_redirects` with `/* /index.html 200`
    - Build: `npm run build` → verify `dist/` output

11. **Final verification**: test all flows end-to-end on mobile + desktop

## Success Criteria

- [ ] All pages responsive on mobile, tablet, desktop
- [ ] Mobile header menu works
- [ ] 404 page renders for invalid routes
- [ ] Error boundary catches render errors
- [ ] Scroll resets on navigation
- [ ] Code splitting reduces initial bundle
- [ ] Page titles update per route
- [ ] Build succeeds without errors
- [ ] Deploy config ready (Vercel or Netlify)

## Risk Assessment

- **Video player mobile**: Touch controls need testing. Fullscreen API behavior varies on iOS.
- **Build size**: Monitor bundle size. Target < 500KB gzipped for initial load.
