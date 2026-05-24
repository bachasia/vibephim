---
phase: 4
title: "Custom Video Player & Watch Page"
status: pending
priority: P1
effort: "2-3h"
dependencies: [3]
---

# Phase 4: Custom Video Player & Watch Page

## Overview

Build custom HLS video player with Netflix-like controls and the Watch page integrating player with episode navigation.

## Requirements

- Functional: HLS.js streams m3u8, custom controls (play/pause/seek/volume/fullscreen/quality), episode prev/next, keyboard shortcuts
- Non-functional: Smooth playback, responsive player, minimal buffering indicator

## Architecture

```
WatchPage (/xem/:slug/:ep)
├── VideoPlayer
│   ├── HLS.js (m3u8 streaming engine)
│   ├── PlayerControls
│   │   ├── PlayPauseButton
│   │   ├── SeekBar (progress + buffer)
│   │   ├── TimeDisplay (current / duration)
│   │   ├── VolumeControl (icon + slider)
│   │   ├── QualitySelector (HLS levels)
│   │   └── FullscreenButton
│   └── PlayerOverlay (title, loading spinner)
├── EpisodeSection (reused from Phase 3, highlight current)
└── MovieInfo (compact — title + quick metadata)
```

## Related Code Files

- Create: `src/components/player/video-player.jsx`
- Create: `src/components/player/player-controls.jsx`
- Modify: `src/pages/watch-page.jsx`
- Modify: `src/components/movie/episode-section.jsx` (add `currentEp` highlight)

## Implementation Steps

1. **VideoPlayer component** — `video-player.jsx`:
   - Props: `src` (m3u8 URL), `title`, `onProgress`, `initialTime`
   - Initialize HLS.js on mount: `new Hls()` → `loadSource(src)` → `attachMedia(videoEl)`
   - Fallback: if browser supports native HLS (Safari), use `<video src>` directly
   - Track state: `playing`, `currentTime`, `duration`, `buffered`, `volume`, `muted`, `isFullscreen`, `quality`
   - Auto-hide controls after 3s of inactivity (show on mouse move)
   - Loading spinner overlay while buffering

2. **PlayerControls component** — `player-controls.jsx`:
   - **Play/Pause**: toggle button with icon swap
   - **Seek bar**: `<input type="range">` styled with Tailwind
     - Progress bar (red) + buffered bar (gray) + total (dark)
     - Click/drag to seek
     - Preview time on hover (optional)
   - **Time display**: `currentTime / duration` formatted as `MM:SS` or `HH:MM:SS`
   - **Volume**: mute icon button + volume slider (show on hover)
   - **Quality selector**: dropdown showing HLS quality levels (auto, 1080p, 720p, etc.)
     - Read levels from `hls.levels`, set via `hls.currentLevel`
   - **Fullscreen**: toggle via `document.fullscreenAPI`
   - **Episode nav**: prev/next episode buttons (if applicable)

3. **Keyboard shortcuts**:
   - Space → play/pause
   - Left/Right arrow → seek ±10s
   - Up/Down arrow → volume ±10%
   - F → fullscreen toggle
   - M → mute toggle
   - Attach `keydown` listener to player container (focused)

4. **Watch page** — `watch-page.jsx`:
   - `useParams()` → slug + ep
   - `useMovieDetail(slug)` to get episodes list
   - Find current episode's m3u8 link from `episodes[serverIndex].server_data`
   - Render VideoPlayer with m3u8 URL
   - Below player: episode section (reuse from Phase 3) with current episode highlighted
   - Compact movie info (title, episode name)
   - Episode prev/next navigation (update URL)

5. **Episode highlight** — update `episode-section.jsx`:
   - Accept `currentEp` prop
   - Highlight active episode button with accent color
   - Scroll active episode into view

6. **HLS error handling**:
   - `Hls.Events.ERROR` → show error message overlay
   - Fatal errors: attempt recovery with `hls.recoverMediaError()`
   - Network errors: show "Unable to load video" with retry button

7. **Verify**: navigate to watch page, video plays, controls work, quality switch works, keyboard shortcuts function

## Success Criteria

- [ ] HLS.js loads and plays m3u8 streams
- [ ] Custom play/pause, seek, volume controls work
- [ ] Quality selector shows available levels
- [ ] Fullscreen toggle works
- [ ] Keyboard shortcuts (space, arrows, F, M) work
- [ ] Episode navigation updates player source
- [ ] Current episode highlighted in episode list
- [ ] Error state shows recovery option
- [ ] Controls auto-hide after inactivity

## Risk Assessment

- **CORS on m3u8 streams**: OPhim streams (opstream10.com) may block cross-origin. If blocked, will need proxy approach.
- **HLS.js browser support**: Works on all modern browsers. Safari uses native HLS, no HLS.js needed.
- **Quality levels**: Not all streams have multiple qualities. Quality selector must handle single-level gracefully.
