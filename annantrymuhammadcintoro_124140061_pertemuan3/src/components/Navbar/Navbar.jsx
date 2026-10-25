import { NavLink } from 'react-router-dom'
import './Navbar.css'

/**
 * Navigasi antar halaman (Beranda & Statistik) pakai React Router.
 * NavLink dipakai (bukan Link biasa) supaya link yang aktif otomatis
 * kebagian class "is-active" tanpa kita harus ngecek URL manual.
 */
function Navbar() {
  return (
    <nav className="navbar">
      <h1 className="navbar__title">Manajemen Buku Pribadi</h1>
      <div className="navbar__links">
        <NavLink to="/" end className={({ isActive }) => (isActive ? 'is-active' : '')}>
          Beranda
        </NavLink>
        <NavLink to="/stats" className={({ isActive }) => (isActive ? 'is-active' : '')}>
          Statistik
        </NavLink>
      </div>
    </nav>
  )
}

export default Navbar
