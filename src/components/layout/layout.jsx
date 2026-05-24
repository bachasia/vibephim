import { Outlet } from 'react-router-dom'
import Header from './header.jsx'
import Footer from './footer.jsx'

export default function Layout() {
  return (
    <>
      <Header />
      <main className="flex-1 pt-16">
        <Outlet />
      </main>
      <Footer />
    </>
  )
}
