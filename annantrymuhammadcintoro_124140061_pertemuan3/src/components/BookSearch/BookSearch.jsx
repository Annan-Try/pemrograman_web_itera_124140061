import PropTypes from 'prop-types'
import './BookSearch.css'

/**
 * Input pencarian buku berdasarkan judul atau nama penulis.
 * controlled component, biar state pencarian tetap terpusat di Home.
 */
function BookSearch({ searchTerm, onSearchChange }) {
  return (
    <div className="book-search">
      <input
        type="search"
        value={searchTerm}
        onChange={(event) => onSearchChange(event.target.value)}
        placeholder="Cari berdasarkan judul atau penulis..."
        aria-label="Cari buku"
      />
    </div>
  )
}

BookSearch.propTypes = {
  searchTerm: PropTypes.string.isRequired,
  onSearchChange: PropTypes.func.isRequired,
}

export default BookSearch
