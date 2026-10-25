import { createContext, useCallback, useContext } from 'react'
import PropTypes from 'prop-types'
import useLocalStorage from '../hooks/useLocalStorage'

// Key localStorage dibuat unik supaya tidak bentrok sama project lain di origin yang sama
const STORAGE_KEY = 'personal-book-manager:books'

// Generator id sederhana. Tidak pakai library uuid supaya dependency tetap ringan,
const generateId = () => `${Date.now()}-${Math.floor(Math.random() * 100000)}`

const BookContext = createContext(undefined)

/**
 * Provider ini membungkus seluruh aplikasi dan jadi satu-satunya sumber kebenaran
 * untuk data buku. Semua operasi (tambah/edit/hapus) lewat sini,
 * sedangkan penyimpanannya didelegasikan ke useLocalStorage supaya data tidak hilang
 * setiap kali halaman di-refresh.
 */
export function BookProvider({ children }) {
  const [books, setBooks] = useLocalStorage(STORAGE_KEY, [])

  const addBook = useCallback(
    (book) => {
      setBooks((prevBooks) => [...prevBooks, { ...book, id: generateId() }])
    },
    [setBooks]
  )

  const updateBook = useCallback(
    (id, updatedFields) => {
      setBooks((prevBooks) =>
        prevBooks.map((book) => (book.id === id ? { ...book, ...updatedFields } : book))
      )
    },
    [setBooks]
  )

  const deleteBook = useCallback(
    (id) => {
      setBooks((prevBooks) => prevBooks.filter((book) => book.id !== id))
    },
    [setBooks]
  )

  const value = { books, addBook, updateBook, deleteBook }

  return <BookContext.Provider value={value}>{children}</BookContext.Provider>
}

BookProvider.propTypes = {
  children: PropTypes.node.isRequired,
}

/**
 * Supaya komponen pemakai tidak perlu import useContext + BookContext setiap saat,
 * dan sekalian ada pengaman kalau dipakai di luar BookProvider.
 */
export function useBooks() {
  const context = useContext(BookContext)
  if (context === undefined) {
    throw new Error('useBooks harus dipanggil di dalam BookProvider')
  }
  return context
}

export default BookContext
