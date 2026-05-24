import { Link } from 'react-router-dom'
import { useFavorites } from '../contexts/favorites-context.jsx'
import { getImageUrl } from '../services/ophim-api.js'

function FavoriteCard({ movie, onRemove }) {
  return (
    <div className="relative group">
      <Link to={`/phim/${movie.slug}`} className="block">
        <div
          className="relative overflow-hidden rounded-sm cursor-pointer"
          style={{
            background: 'var(--bg-2)',
            transition: 'transform 400ms ease, box-shadow 400ms ease',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'scale(1.05)'
            e.currentTarget.style.boxShadow = '0 10px 40px rgba(0,0,0,0.7)'
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'scale(1)'
            e.currentTarget.style.boxShadow = 'none'
          }}
        >
          <div className="aspect-[2/3] overflow-hidden">
            <img
              src={getImageUrl(movie.thumb_url)}
              alt={movie.name}
              loading="lazy"
              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
              onError={(e) => { e.target.style.display = 'none' }}
            />
          </div>
          <div
            className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
            style={{ background: 'rgba(0,0,0,0.4)' }}
          />
          {/* Quality badge */}
          {movie.quality && (
            <span
              className="absolute top-1.5 right-1.5 font-mono text-[9px] font-bold px-1.5 py-0.5 rounded-sm uppercase leading-none"
              style={{ background: 'var(--primary)', color: 'var(--primary-btn-text)' }}
            >
              {movie.quality}
            </span>
          )}
        </div>

        {/* Info panel */}
        <div className="px-2 pt-2 pb-3" style={{ background: 'var(--bg-2)' }}>
          <p className="text-[13px] font-semibold truncate text-white">{movie.name}</p>
          {movie.year && (
            <p className="text-[11px] mt-0.5 font-mono" style={{ color: '#737373' }}>{movie.year}</p>
          )}
        </div>
      </Link>

      {/* Remove button — top right, over poster */}
      <button
        onClick={() => onRemove(movie.slug)}
        aria-label="Xóa khỏi yêu thích"
        className="absolute top-1.5 right-1.5 w-6 h-6 rounded-full flex items-center justify-center text-sm font-bold opacity-0 group-hover:opacity-100 transition-all duration-200"
        style={{
          background: 'rgba(0,0,0,0.75)',
          border: '1px solid rgba(255,255,255,0.2)',
          color: 'rgba(255,255,255,0.8)',
          zIndex: 5,
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.background = 'var(--primary)'
          e.currentTarget.style.color = 'var(--primary-btn-text)'
          e.currentTarget.style.borderColor = 'var(--primary)'
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.background = 'rgba(0,0,0,0.75)'
          e.currentTarget.style.color = 'rgba(255,255,255,0.8)'
          e.currentTarget.style.borderColor = 'rgba(255,255,255,0.2)'
        }}
      >
        ✕
      </button>
    </div>
  )
}

export default function FavoritesPage() {
  const { favorites, removeFavorite, clearFavorites } = useFavorites()

  return (
    <div className="min-h-screen text-white" style={{ background: 'var(--bg-color)' }}>
      {/* Page title bar */}
      <div
        className="flex items-center justify-between px-8 pt-24 pb-5"
        style={{ borderBottom: '1px solid rgba(255,255,255,0.1)' }}
      >
        <div>
          <h1 className="text-2xl font-bold">♡ Phim Yêu Thích</h1>
          <p className="text-sm mt-2 font-mono" style={{ color: '#b3b3b3' }}>
            {favorites.length} phim đã lưu
          </p>
        </div>
        {favorites.length > 0 && (
          <button
            onClick={() => favorites.forEach((m) => removeFavorite(m.slug))}
            className="text-sm transition-all duration-200"
            style={{
              padding: '8px 16px',
              border: '1px solid rgba(255,216,117,0.5)',
              borderRadius: '2px',
              background: 'transparent',
              color: 'var(--primary)',
            }}
            onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(255,216,117,0.1)' }}
            onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent' }}
          >
            Xóa tất cả
          </button>
        )}
      </div>

      {/* Grid */}
      <div className="px-8 py-5 pb-16">
        {favorites.length === 0 ? (
          <div className="py-20 text-center">
            <p className="text-sm mb-4" style={{ color: '#737373' }}>Chưa có phim yêu thích nào.</p>
            <Link to="/browse" className="text-sm font-medium" style={{ color: 'var(--primary)' }}>
              Khám phá phim →
            </Link>
          </div>
        ) : (
          <div className="grid gap-3" style={{
            gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))',
          }}>
            {favorites.map((m) => (
              <FavoriteCard key={m.slug} movie={m} onRemove={removeFavorite} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
