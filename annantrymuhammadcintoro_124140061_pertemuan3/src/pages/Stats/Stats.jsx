import { useBooks } from '../../context/BookContext'
import useBookStats from '../../hooks/useBookStats'
import './Stats.css'

/**
 * Halaman statistik. Semua angka di sini dihitung lewat custom hook
 * useBookStats supaya halaman ini tinggal "menampilkan", tanpa perlu tahu
 * detail cara menghitungnya.
 */
function Stats() {
  const { books } = useBooks()
  const stats = useBookStats(books)

  return (
    <div className="stats-page">
      <h2>Statistik Koleksi Buku</h2>

      <div className="stats-grid">
        <div className="stats-card">
          <span className="stats-card__number">{stats.total}</span>
          <span className="stats-card__label">Total Buku</span>
        </div>
        <div className="stats-card stats-card--milik">
          <span className="stats-card__number">{stats.milik}</span>
          <span className="stats-card__label">Dimiliki ({stats.percentageMilik}%)</span>
        </div>
        <div className="stats-card stats-card--baca">
          <span className="stats-card__number">{stats.baca}</span>
          <span className="stats-card__label">Sedang Dibaca ({stats.percentageBaca}%)</span>
        </div>
        <div className="stats-card stats-card--beli">
          <span className="stats-card__number">{stats.beli}</span>
          <span className="stats-card__label">Ingin Dibeli ({stats.percentageBeli}%)</span>
        </div>
      </div>

      {stats.total === 0 && (
        <p className="stats-empty">
          Belum ada data buku. Tambahkan buku dulu lewat halaman Beranda.
        </p>
      )}
    </div>
  )
}

export default Stats
