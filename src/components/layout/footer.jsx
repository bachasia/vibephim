import { Link } from 'react-router-dom'

export default function Footer() {
  return (
    <footer className="mt-auto py-8 px-6 border-t border-white/10">
      <div className="max-w-screen-xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        <Link
          to="/"
          className="text-lg font-black tracking-tight"
          style={{ color: '#e50914' }}
        >
          VibePHim
        </Link>
        <p className="text-xs text-[#737373] text-center">
          Dữ liệu phim cung cấp bởi{' '}
          <a
            href="https://ophim1.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[#b3b3b3] hover:text-white transition-colors"
          >
            OPhim API
          </a>
          . Chỉ dùng cho mục đích học tập.
        </p>
        <p className="text-xs text-[#737373]">© {new Date().getFullYear()} VibePHim</p>
      </div>
    </footer>
  )
}
