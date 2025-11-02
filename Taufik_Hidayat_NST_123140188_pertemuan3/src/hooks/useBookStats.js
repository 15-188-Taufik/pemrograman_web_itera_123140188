// src/hooks/useBookStats.js

import { useMemo } from 'react';
import { useBooks } from '../context/BookContext'; // Impor hook context kita

export const useBookStats = () => {
  // Ambil data buku langsung dari context
  const { books } = useBooks();

  // Gunakan useMemo agar statistik tidak dihitung ulang di setiap render,
  // tapi hanya jika array 'books' berubah.
  const stats = useMemo(() => {
    return {
      total: books.length,
      owned: books.filter(book => book.status === 'Owned').length,
      reading: books.filter(book => book.status === 'Reading').length,
      wishlist: books.filter(book => book.status === 'Wishlist').length,
    };
  }, [books]); // Dependensi: 'books'

  return stats; // Kembalikan objek statistik
};