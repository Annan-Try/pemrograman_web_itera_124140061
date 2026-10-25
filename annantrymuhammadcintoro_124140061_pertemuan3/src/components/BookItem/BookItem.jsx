import PropTypes from 'prop-types'
import './BookItem.css'

const STATUS_LABELS = {
  milik: 'Dimiliki',
  baca: 'Sedang Dibaca',
  beli: 'Ingin Dibeli',
}

/**
 * Satu baris/kartu buku. Dipisah dari BookList supaya BookList fokus ke
 * urusan "render daftar" sementara BookItem fokus ke "tampilan satu item".
 * Komponen ini juga reusable kalau nanti dibutuhkan di halaman lain.
 */
function BookItem({ book, onEdit, onDelete }) {
  return (
    <li className={`book-item book-item--${book.status}`}>
      <div className="book-item__info">
        <h3>{book.title}</h3>
        <p>{book.author}</p>
        <span className="book-item__status">{STATUS_LABELS[book.status]}</span>
      </div>
      <div className="book-item__actions">
        <button type="button" className="btn btn-small" onClick={() => onEdit(book)}>
          Edit
        </button>
        <button
          type="button"
          className="btn btn-small btn-danger"
          onClick={() => onDelete(book.id)}
        >
          Hapus
        </button>
      </div>
    </li>
  )
}

BookItem.propTypes = {
  book: PropTypes.shape({
    id: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    author: PropTypes.string.isRequired,
    status: PropTypes.oneOf(['milik', 'baca', 'beli']).isRequired,
  }).isRequired,
  onEdit: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
}

export default BookItem
