import { Link } from 'react-router-dom'
import { MOVIE_TYPES } from '../../utils/constants.js'

const TOPICS = [
  {
    label: 'Phim Bộ',
    sub: 'Xem chủ đề',
    to: `/browse?type=${MOVIE_TYPES.SERIES}`,
    // amber — gần với golden accent của site
    gradient: 'linear-gradient(140deg, #c8850a 0%, #e8b030 100%)',
  },
  {
    label: 'Phim Lẻ',
    sub: 'Xem chủ đề',
    to: `/browse?type=${MOVIE_TYPES.MOVIE}`,
    // cerulean — lạnh bổ trợ cho nền navy
    gradient: 'linear-gradient(140deg, #1e7eb8 0%, #38a8d8 100%)',
  },
  {
    label: 'Hoạt Hình',
    sub: 'Xem chủ đề',
    to: `/browse?type=${MOVIE_TYPES.ANIME}`,
    // violet — tương phản với golden
    gradient: 'linear-gradient(140deg, #7040c8 0%, #a868e8 100%)',
  },
  {
    label: 'Hàn Quốc',
    sub: 'Xem chủ đề',
    to: '/quoc-gia/han-quoc',
    // rose — warm accent thứ 2
    gradient: 'linear-gradient(140deg, #c83868 0%, #e86090 100%)',
  },
  {
    label: 'Âu Mỹ',
    sub: 'Xem chủ đề',
    to: '/quoc-gia/au-my',
    // crimson — bold, điện ảnh
    gradient: 'linear-gradient(140deg, #b82838 0%, #d85060 100%)',
  },
  {
    label: 'Trung Quốc',
    sub: 'Xem chủ đề',
    to: '/quoc-gia/trung-quoc',
    // emerald — tươi, cân bằng palette
    gradient: 'linear-gradient(140deg, #1e9858 0%, #38c878 100%)',
  },
  {
    label: 'TV Shows',
    sub: 'Xem chủ đề',
    to: `/browse?type=${MOVIE_TYPES.TV}`,
    // cobalt — deep, premium
    gradient: 'linear-gradient(140deg, #2848a8 0%, #5070c8 100%)',
  },
]

export default function CategoryTopics() {
  return (
    <section
      className="px-6 md:px-12 pt-6 pb-8 animate-fade-in"
      style={{ position: 'relative', zIndex: 15, marginTop: '-70px' }}
    >
      <h2
        className="font-semibold mb-4"
        style={{ fontSize: 'clamp(1rem, 2.5vw, 1.3rem)', color: '#fff' }}
      >
        Bạn đang quan tâm gì?
      </h2>

      {/* Desktop: equal-width grid. Mobile: horizontal scroll. */}
      <div
        className="hidden md:grid"
        style={{ gridTemplateColumns: 'repeat(7, 1fr)', gap: '10px' }}
      >
        {TOPICS.map((topic) => <TopicCard key={topic.to} topic={topic} />)}
      </div>

      <div
        className="flex md:hidden gap-3 overflow-x-auto pb-1"
        style={{ scrollbarWidth: 'none' }}
      >
        {TOPICS.map((topic) => (
          <div key={topic.to} className="flex-shrink-0" style={{ width: '140px' }}>
            <TopicCard topic={topic} />
          </div>
        ))}
      </div>
    </section>
  )
}

function TopicCard({ topic }) {
  return (
    <Link
      to={topic.to}
      className="flex flex-col justify-end w-full"
      style={{
        height: '110px',
        borderRadius: '10px',
        background: topic.gradient,
        padding: '14px 16px',
        transition: 'transform 200ms ease, filter 200ms ease',
      }}
      onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-3px)'; e.currentTarget.style.filter = 'brightness(1.08)' }}
      onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.filter = 'brightness(1)' }}
    >
      <p
        className="font-bold leading-snug mb-1"
        style={{ fontSize: '15px', color: '#fff', textShadow: '0 1px 4px rgba(0,0,0,0.3)' }}
      >
        {topic.label}
      </p>
      <p
        className="flex items-center gap-0.5"
        style={{ fontSize: '12px', color: 'rgba(255,255,255,0.8)' }}
      >
        {topic.sub}
        <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
          <polyline points="9 18 15 12 9 6" />
        </svg>
      </p>
    </Link>
  )
}
