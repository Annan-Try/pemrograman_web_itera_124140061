import { describe, expect, it, vi } from 'vitest'
import { fireEvent, render, screen } from '@testing-library/react'
import BookForm from './BookForm'

describe('BookForm', () => {
  it('menampilkan pesan error kalau judul dan penulis dikosongkan', () => {
    const handleSubmit = vi.fn()
    render(<BookForm onSubmit={handleSubmit} />)

    fireEvent.click(screen.getByRole('button', { name: /tambah buku/i }))

    expect(screen.getByText(/judul buku wajib diisi/i)).toBeInTheDocument()
    expect(screen.getByText(/nama penulis wajib diisi/i)).toBeInTheDocument()
    expect(handleSubmit).not.toHaveBeenCalled()
  })

  it('memanggil onSubmit dengan data form ketika input sudah valid', () => {
    const handleSubmit = vi.fn()
    render(<BookForm onSubmit={handleSubmit} />)

    fireEvent.change(screen.getByLabelText(/judul buku/i), {
      target: { value: 'Laskar Pelangi' },
    })
    fireEvent.change(screen.getByLabelText(/penulis/i), {
      target: { value: 'Andrea Hirata' },
    })
    fireEvent.click(screen.getByRole('button', { name: /tambah buku/i }))

    expect(handleSubmit).toHaveBeenCalledWith({
      title: 'Laskar Pelangi',
      author: 'Andrea Hirata',
      status: 'milik',
    })
  })
})
