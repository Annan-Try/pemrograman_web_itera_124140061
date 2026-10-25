import { useState } from 'react'
import PropTypes from 'prop-types'
import './BookForm.css'

const STATUS_OPTIONS = [
  { value: 'milik', label: 'Dimiliki' },
  { value: 'baca', label: 'Sedang Dibaca' },
  { value: 'beli', label: 'Ingin Dibeli' },
]

const EMPTY_FORM = { title: '', author: '', status: 'milik' }

/**
 * Form tambah/edit buku. Komponen ini "dua wajah": kalau `initialData` kosong
 * dia jadi form tambah, kalau `initialData` diisi (dari tombol Edit di BookList)
 * dia otomatis terisi dan berubah jadi form edit.
 *
 * Validasi yang diterapkan: judul & penulis wajib diisi. Kalau kosong, field
 * yang bermasalah dikasih border merah + pesan error di bawahnya.
 */
function BookForm({ initialData = null, onSubmit, onCancel = () => {} }) {
  const [form, setForm] = useState(initialData || EMPTY_FORM)
  const [errors, setErrors] = useState({})
  // Dipakai buat mendeteksi perubahan initialData selagi render, tanpa butuh useEffect
  const [prevInitialData, setPrevInitialData] = useState(initialData)

  // Setiap kali initialData berubah (misal user klik Edit pada buku lain),
  // form harus ikut ter-reset mengikuti data buku yang baru dipilih.
  if (initialData !== prevInitialData) {
    setPrevInitialData(initialData)
    setForm(initialData || EMPTY_FORM)
    setErrors({})
  }

  const validate = (data) => {
    const newErrors = {}
    if (!data.title.trim()) newErrors.title = 'Judul buku wajib diisi'
    if (!data.author.trim()) newErrors.author = 'Nama penulis wajib diisi'
    return newErrors
  }

  const handleChange = (event) => {
    const { name, value } = event.target
    setForm((prev) => ({ ...prev, [name]: value }))

    // UX kecil: begitu user mulai mengetik lagi, pesan error field itu langsung hilang
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }))
    }
  }

  const handleSubmit = (event) => {
    event.preventDefault()
    const validationErrors = validate(form)

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors)
      return
    }

    onSubmit(form)

    // Form tambah dikosongkan lagi setelah submit sukses (mode edit ditutup dari parent)
    if (!initialData) {
      setForm(EMPTY_FORM)
    }
  }

  return (
    <form className="book-form" onSubmit={handleSubmit} noValidate>
      <div className="book-form__field">
        <label htmlFor="title">Judul Buku</label>
        <input
          id="title"
          name="title"
          type="text"
          value={form.title}
          onChange={handleChange}
          className={errors.title ? 'input-error' : ''}
          placeholder="Contoh: Laskar Pelangi"
        />
        {errors.title && <span className="error-message">{errors.title}</span>}
      </div>

      <div className="book-form__field">
        <label htmlFor="author">Penulis</label>
        <input
          id="author"
          name="author"
          type="text"
          value={form.author}
          onChange={handleChange}
          className={errors.author ? 'input-error' : ''}
          placeholder="Contoh: Andrea Hirata"
        />
        {errors.author && <span className="error-message">{errors.author}</span>}
      </div>

      <div className="book-form__field">
        <label htmlFor="status">Status</label>
        <select id="status" name="status" value={form.status} onChange={handleChange}>
          {STATUS_OPTIONS.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>

      <div className="book-form__actions">
        <button type="submit" className="btn btn-primary">
          {initialData ? 'Simpan Perubahan' : 'Tambah Buku'}
        </button>
        {initialData && (
          <button type="button" className="btn btn-secondary" onClick={onCancel}>
            Batal
          </button>
        )}
      </div>
    </form>
  )
}

BookForm.propTypes = {
  initialData: PropTypes.shape({
    id: PropTypes.string,
    title: PropTypes.string,
    author: PropTypes.string,
    status: PropTypes.oneOf(['milik', 'baca', 'beli']),
  }),
  onSubmit: PropTypes.func.isRequired,
  onCancel: PropTypes.func,
}

export default BookForm
