import { Link } from 'react-router-dom'

export default function NotFoundPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center text-center px-6">
      <p className="text-8xl font-black select-none mb-6" style={{ color: 'var(--bg-4)' }}>404</p>
      <h1 className="text-2xl font-bold text-white mb-2">Trang không tồn tại</h1>
      <p className="text-zinc-500 text-sm mb-8 max-w-sm">
        Phim bạn tìm có thể đã bị xóa hoặc đường dẫn không chính xác.
      </p>
      <Link
        to="/"
        className="px-6 py-2.5 text-sm font-bold text-white rounded-sm transition-opacity hover:opacity-80"
        style={{ background: 'var(--primary)', color: 'var(--primary-btn-text)' }}
      >
        Về trang chủ
      </Link>
    </div>
  )
}
