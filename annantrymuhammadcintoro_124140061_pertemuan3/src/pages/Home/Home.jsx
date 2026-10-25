import { useEffect, useMemo, useState } from 'react'
import { useBooks } from '../../context/BookContext'
import BookForm from '../../components/BookForm/BookForm'
import BookFilter from '../../components/BookFilter/BookFilter'
import BookSearch from '../../components/BookSearch/BookSearch'
import BookList from '../../components/BookList/BookList'
import './Home.css'

/**
 * Halaman utama: tempat nambah/edit buku, filter berdasarkan status,
 * dan cari buku berdasarkan judul/penulis. State filter & pencarian
 * sengaja disimpan lokal di sini (bukan di Context) karena cuma
 * relevan buat tampilan halaman ini saja.
 */
function Home() {
  const { books, addBook, updateBook, deleteBook } = useBooks()
  const [filter, setFilter] = useState('semua')
  const [searchTerm, setSearchTerm] = useState('')
  const [editingBook, setEditingBook] = useState(null)

  // Contoh pemakaian useEffect: judul tab browser ikut berubah sesuai jumlah
  // buku yang tersimpan, biar user langsung dapat info tanpa buka halaman Stats.
  useEffect(() => {
    document.title = `Manajemen Buku Pribadi (${books.length})`
  }, [books.length])

  // useMemo supaya proses filter+search tidak diulang-ulang setiap render
  // kalau books/filter/searchTerm tidak berubah.
  const filteredBooks = useMemo(() => {
    const keyword = searchTerm.trim().toLowerCase()

    return books
      .filter((book) => (filter === 'semua' ? true : book.status === filter))
      .filter((book) => {
        if (!keyword) return true
        return (
          book.title.toLowerCase().includes(keyword) ||
          book.author.toLowerCase().includes(keyword)
        )
      })
  }, [books, filter, searchTerm])

  const handleSubmit = (formData) => {
    if (editingBook) {
      updateBook(editingBook.id, formData)
      setEditingBook(null)
    } else {
      addBook(formData)
    }
  }

  const handleEdit = (book) => setEditingBook(book)

  const handleCancelEdit = () => setEditingBook(null)

  const handleDelete = (id) => {
    // Kalau buku yang sedang diedit kebetulan dihapus, tutup dulu form editnya
    if (editingBook?.id === id) setEditingBook(null)
    deleteBook(id)
  }

  return (
    <div className="home-page">
      <section className="home-page__form-section">
        <h2>{editingBook ? 'Edit Buku' : 'Tambah Buku Baru'}</h2>
        <BookForm initialData={editingBook} onSubmit={handleSubmit} onCancel={handleCancelEdit} />
      </section>

      <section className="home-page__list-section">
        <div className="home-page__toolbar">
          <BookSearch searchTerm={searchTerm} onSearchChange={setSearchTerm} />
          <BookFilter currentFilter={filter} onFilterChange={setFilter} />
        </div>
        <BookList books={filteredBooks} onEdit={handleEdit} onDelete={handleDelete} />
      </section>
    </div>
  )
}

export default Home
