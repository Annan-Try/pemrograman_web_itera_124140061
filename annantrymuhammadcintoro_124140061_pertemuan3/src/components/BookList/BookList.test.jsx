import { describe, expect, it, vi } from 'vitest'
import { fireEvent, render, screen } from '@testing-library/react'
import BookList from './BookList'

const books = [
  { id: '1', title: 'Laskar Pelangi', author: 'Andrea Hirata', status: 'milik' },
  { id: '2', title: 'Bumi Manusia', author: 'Pramoedya Ananta Toer', status: 'baca' },
]

describe('BookList', () => {
  it('menampilkan pesan kosong ketika tidak ada buku', () => {
    render(<BookList books={[]} onEdit={vi.fn()} onDelete={vi.fn()} />)
    expect(screen.getByText(/belum ada buku/i)).toBeInTheDocument()
  })

  it('merender semua buku yang diberikan', () => {
    render(<BookList books={books} onEdit={vi.fn()} onDelete={vi.fn()} />)
    expect(screen.getByText('Laskar Pelangi')).toBeInTheDocument()
    expect(screen.getByText('Bumi Manusia')).toBeInTheDocument()
  })

  it('memanggil onDelete dengan id yang benar saat tombol Hapus diklik', () => {
    const handleDelete = vi.fn()
    render(<BookList books={books} onEdit={vi.fn()} onDelete={handleDelete} />)

    const deleteButtons = screen.getAllByRole('button', { name: /hapus/i })
    fireEvent.click(deleteButtons[0])

    expect(handleDelete).toHaveBeenCalledWith('1')
  })
})
