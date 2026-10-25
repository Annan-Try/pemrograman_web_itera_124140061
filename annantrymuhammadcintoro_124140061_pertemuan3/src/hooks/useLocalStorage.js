import { useEffect, useState } from 'react'

/**
 * Custom hook generik buat menyinkronkan sebuah state React dengan localStorage.
 *
 * Kenapa dibikin terpisah dari BookContext? Supaya hook ini bisa dipakai ulang
 * untuk kebutuhan lain juga (bukan cuma data buku), dan lebih gampang dites sendiri.
 *
 * @param {string} key - nama key di localStorage
 * @param {*} initialValue - nilai default kalau belum ada data tersimpan
 * @returns {[*, Function]} tuple [value, setValue] mirip seperti useState biasa
 */
function useLocalStorage(key, initialValue) {
  const [storedValue, setStoredValue] = useState(() => {
    // Lazy initializer: baca localStorage sekali aja waktu komponen pertama kali mount
    try {
      const item = window.localStorage.getItem(key)
      return item ? JSON.parse(item) : initialValue
    } catch (error) {
      // Kalau JSON-nya korup atau localStorage tidak tersedia (mis. mode private),
      // fallback ke initialValue aja daripada bikin app crash
      console.error(`useLocalStorage: gagal membaca key "${key}"`, error)
      return initialValue
    }
  })

  useEffect(() => {
    try {
      window.localStorage.setItem(key, JSON.stringify(storedValue))
    } catch (error) {
      console.error(`useLocalStorage: gagal menyimpan key "${key}"`, error)
    }
  }, [key, storedValue])

  return [storedValue, setStoredValue]
}

export default useLocalStorage
