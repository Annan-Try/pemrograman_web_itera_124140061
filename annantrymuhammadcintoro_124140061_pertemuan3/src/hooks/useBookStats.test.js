import { describe, expect, it } from 'vitest'
import { renderHook } from '@testing-library/react'
import useBookStats from './useBookStats'

const sampleBooks = [
  { id: '1', title: 'A', author: 'X', status: 'milik' },
  { id: '2', title: 'B', author: 'Y', status: 'baca' },
  { id: '3', title: 'C', author: 'Z', status: 'beli' },
  { id: '4', title: 'D', author: 'W', status: 'milik' },
]

describe('useBookStats', () => {
  it('menghitung total dan jumlah per status dengan benar', () => {
    const { result } = renderHook(() => useBookStats(sampleBooks))
    expect(result.current.total).toBe(4)
    expect(result.current.milik).toBe(2)
    expect(result.current.baca).toBe(1)
    expect(result.current.beli).toBe(1)
    expect(result.current.percentageMilik).toBe(50)
  })

  it('mengembalikan semua angka nol ketika array buku kosong', () => {
    const { result } = renderHook(() => useBookStats([]))
    expect(result.current.total).toBe(0)
    expect(result.current.percentageMilik).toBe(0)
  })
})
