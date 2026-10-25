import PropTypes from 'prop-types'
import BookItem from '../BookItem/BookItem'
import './BookList.css'

/**
 * Merender daftar buku hasil filter + pencarian dari halaman Home.
 * cuma menerima array `books` yang sudah jadi dan merendernya satu per satu lewat BookItem.
 */
function BookList({ books, onEdit, onDelete }) {
  if (books.length === 0) {
    return (
      <p className="book-list__empty">
        Belum ada buku yang cocok. Coba tambah buku baru atau ubah filter/kata kunci pencarian.
      </p>
    )
  }

  return (
    <ul className="book-list">
      {books.map((book) => (
        <BookItem key={book.id} book={book} onEdit={onEdit} onDelete={onDelete} />
      ))}
    </ul>
  )
}

BookList.propTypes = {
  books: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      title: PropTypes.string.isRequired,
      author: PropTypes.string.isRequired,
      status: PropTypes.oneOf(['milik', 'baca', 'beli']).isRequired,
    })
  ).isRequired,
  onEdit: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
}

export default BookList
