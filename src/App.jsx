import { lazy, Suspense } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { FavoritesProvider } from './contexts/favorites-context.jsx'
import { WatchHistoryProvider } from './contexts/watch-history-context.jsx'
import ErrorBoundary from './components/ui/error-boundary.jsx'
import ScrollToTop from './components/ui/scroll-to-top.jsx'
import Layout from './components/layout/layout.jsx'

// Lazy-load pages for code splitting
const HomePage       = lazy(() => import('./pages/home-page.jsx'))
const BrowsePage     = lazy(() => import('./pages/browse-page.jsx'))
const DetailPage     = lazy(() => import('./pages/detail-page.jsx'))
const WatchPage      = lazy(() => import('./pages/watch-page.jsx'))
const SearchPage     = lazy(() => import('./pages/search-page.jsx'))
const CategoryPage   = lazy(() => import('./pages/category-page.jsx'))
const CountryPage    = lazy(() => import('./pages/country-page.jsx'))
const FavoritesPage  = lazy(() => import('./pages/favorites-page.jsx'))
const HistoryPage    = lazy(() => import('./pages/history-page.jsx'))
const NotFoundPage   = lazy(() => import('./pages/not-found-page.jsx'))

function PageLoader() {
  return (
    <div className="min-h-screen bg-zinc-950 flex items-center justify-center">
      <div className="w-8 h-8 border-4 border-white/20 border-t-white rounded-full animate-spin" />
    </div>
  )
}

export default function App() {
  return (
    <ErrorBoundary>
      <FavoritesProvider>
        <WatchHistoryProvider>
          <BrowserRouter>
            <ScrollToTop />
            <Suspense fallback={<PageLoader />}>
              <Routes>
                <Route element={<Layout />}>
                  <Route path="/"                  element={<HomePage />} />
                  <Route path="/browse"            element={<BrowsePage />} />
                  <Route path="/phim/:slug"        element={<DetailPage />} />
                  <Route path="/xem/:slug/:ep"     element={<WatchPage />} />
                  <Route path="/tim-kiem"          element={<SearchPage />} />
                  <Route path="/the-loai/:slug"    element={<CategoryPage />} />
                  <Route path="/quoc-gia/:slug"    element={<CountryPage />} />
                  <Route path="/yeu-thich"         element={<FavoritesPage />} />
                  <Route path="/lich-su"           element={<HistoryPage />} />
                  <Route path="*"                  element={<NotFoundPage />} />
                </Route>
              </Routes>
            </Suspense>
          </BrowserRouter>
        </WatchHistoryProvider>
      </FavoritesProvider>
    </ErrorBoundary>
  )
}
