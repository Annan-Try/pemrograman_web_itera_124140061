import { beforeEach, describe, expect, it } from 'vitest'
import { act, renderHook } from '@testing-library/react'
import useLocalStorage from './useLocalStorage'

describe('useLocalStorage', () => {
  beforeEach(() => {
    window.localStorage.clear()
  })

  it('mengembalikan initialValue kalau localStorage masih kosong', () => {
    const { result } = renderHook(() => useLocalStorage('test-key', ['a']))
    expect(result.current[0]).toEqual(['a'])
  })

  it('menyimpan value baru ke localStorage setiap kali setter dipanggil', () => {
    const { result } = renderHook(() => useLocalStorage('test-key', []))

    act(() => {
      result.current[1](['buku 1'])
    })

    expect(result.current[0]).toEqual(['buku 1'])
    expect(JSON.parse(window.localStorage.getItem('test-key'))).toEqual(['buku 1'])
  })

  it('membaca ulang data yang sudah tersimpan saat hook pertama kali dipakai', () => {
    window.localStorage.setItem('existing-key', JSON.stringify(['sudah ada']))
    const { result } = renderHook(() => useLocalStorage('existing-key', []))
    expect(result.current[0]).toEqual(['sudah ada'])
  })
})
