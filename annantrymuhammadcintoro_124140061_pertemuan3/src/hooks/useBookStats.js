import { useMemo } from 'react'

/**
 * Custom hook buat ngitung statistik koleksi buku (total & per status).
 *
 * Sengaja dipisah dari halaman Stats biar logika hitung-hitungannya murni
 * (pure function di dalam useMemo) dan gampang ditulis unit test-nya tanpa
 * perlu render komponen sama sekali.
 *
 * @param {Array} books - array buku dari BookContext
 */
function useBookStats(books) {
  return useMemo(() => {
    const total = books.length
    const milik = books.filter((book) => book.status === 'milik').length
    const baca = books.filter((book) => book.status === 'baca').length
    const beli = books.filter((book) => book.status === 'beli').length

    const toPercentage = (count) => (total === 0 ? 0 : Math.round((count / total) * 100))

    return {
      total,
      milik,
      baca,
      beli,
      percentageMilik: toPercentage(milik),
      percentageBaca: toPercentage(baca),
      percentageBeli: toPercentage(beli),
    }
  }, [books])
}

export default useBookStats
