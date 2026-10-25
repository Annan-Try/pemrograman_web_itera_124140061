import PropTypes from 'prop-types'
import './BookFilter.css'

const FILTER_OPTIONS = [
  { value: 'semua', label: 'Semua' },
  { value: 'milik', label: 'Dimiliki' },
  { value: 'baca', label: 'Sedang Dibaca' },
  { value: 'beli', label: 'Ingin Dibeli' },
]

/**
 * Tombol-tombol filter berdasarkan status buku. Komponen ini "controlled"
 * sepenuhnya oleh parent (Home) lewat props currentFilter & onFilterChange,
 * jadi tidak menyimpan state sendiri.
 */
function BookFilter({ currentFilter, onFilterChange }) {
  return (
    <div className="book-filter" role="group" aria-label="Filter status buku">
      {FILTER_OPTIONS.map((option) => (
        <button
          key={option.value}
          type="button"
          className={`book-filter__btn ${currentFilter === option.value ? 'is-active' : ''}`}
          onClick={() => onFilterChange(option.value)}
        >
          {option.label}
        </button>
      ))}
    </div>
  )
}

BookFilter.propTypes = {
  currentFilter: PropTypes.oneOf(['semua', 'milik', 'baca', 'beli']).isRequired,
  onFilterChange: PropTypes.func.isRequired,
}

export default BookFilter
