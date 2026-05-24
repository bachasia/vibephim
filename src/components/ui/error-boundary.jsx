import { Component } from 'react'

export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError() {
    return { hasError: true }
  }

  componentDidCatch(error, info) {
    console.error('ErrorBoundary caught:', error, info)
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex flex-col items-center justify-center text-center px-6">
          <h1 className="text-xl font-bold text-white mb-2">Đã xảy ra lỗi</h1>
          <p className="text-zinc-500 text-sm mb-6">Vui lòng tải lại trang để tiếp tục.</p>
          <button
            onClick={() => this.setState({ hasError: false })}
            className="px-6 py-2.5 text-sm font-bold text-white rounded-sm hover:opacity-80 transition-opacity"
            style={{ background: 'var(--primary)', color: 'var(--primary-btn-text)' }}
          >
            Thử lại
          </button>
        </div>
      )
    }
    return this.props.children
  }
}
