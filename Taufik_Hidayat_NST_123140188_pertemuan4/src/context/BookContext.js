// src/context/BookContext.js

import React, { createContext, useContext } from 'react';
import { useLocalStorage } from '../hooks/useLocalStorage';

// 1. Buat Context
const BookContext = createContext();

// 2. Buat Hook kustom untuk memudahkan penggunaan context
export const useBooks = () => {
  return useContext(BookContext);
};

// 3. Buat Provider
export const BookProvider = ({ children }) => {
  // Gunakan useLocalStorage untuk mendapatkan dan mengatur buku
  // 'books' adalah key di localStorage, [] adalah nilai awal jika kosong
  const [books, setBooks] = useLocalStorage('books', []);

  // --- Fungsi CRUD ---

  // CREATE
  const addBook = (newBook) => {
    // Menambahkan ID unik (timestamp sederhana)
    const bookWithId = { ...newBook, id: Date.now() };
    setBooks(prevBooks => [...prevBooks, bookWithId]);
  };

  // UPDATE
  const updateBook = (id, updatedBook) => {
    setBooks(prevBooks => 
      prevBooks.map(book => 
        book.id === id ? { ...book, ...updatedBook } : book
      )
    );
  };

  // DELETE
  const deleteBook = (id) => {
    setBooks(prevBooks => prevBooks.filter(book => book.id !== id));
  };

  // 4. Nilai yang akan dibagikan ke semua komponen
  const value = {
    books,
    addBook,
    updateBook,
    deleteBook,
  };

  return (
    <BookContext.Provider value={value}>
      {children}
    </BookContext.Provider>
  );
};