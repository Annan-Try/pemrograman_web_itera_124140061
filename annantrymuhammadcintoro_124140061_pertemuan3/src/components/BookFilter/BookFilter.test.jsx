import { describe, expect, it, vi } from 'vitest'
import { fireEvent, render, screen } from '@testing-library/react'
import BookFilter from './BookFilter'

describe('BookFilter', () => {
  it('menandai tombol filter yang sedang aktif', () => {
    render(<BookFilter currentFilter="baca" onFilterChange={vi.fn()} />)
    expect(screen.getByRole('button', { name: /sedang dibaca/i })).toHaveClass('is-active')
  })

  it('memanggil onFilterChange dengan value yang benar saat tombol diklik', () => {
    const handleChange = vi.fn()
    render(<BookFilter currentFilter="semua" onFilterChange={handleChange} />)

    fireEvent.click(screen.getByRole('button', { name: /^dimiliki$/i }))

    expect(handleChange).toHaveBeenCalledWith('milik')
  })
})
