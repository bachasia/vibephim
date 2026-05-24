import { Outlet } from 'react-router-dom'
import Header from './header.jsx'
import Footer from './footer.jsx'
import MobileBottomNav from './mobile-bottom-nav.jsx'

export default function Layout() {
  return (
    <>
      <Header />
      <main className="flex-1 pb-[60px] md:pb-0">
        <Outlet />
      </main>
      <Footer />
      <MobileBottomNav />
    </>
  )
}
