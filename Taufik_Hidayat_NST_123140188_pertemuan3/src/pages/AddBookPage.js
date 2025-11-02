// src/pages/AddBookPage.js

import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useBooks } from '../context/BookContext';
import BookForm from '../components/BookForm/BookForm';

const AddBookPage = () => {
  const { addBook } = useBooks(); // Ambil fungsi addBook
  const navigate = useNavigate(); // Untuk redirect setelah submit

  const handleSubmit = (formData) => {
    addBook(formData); // Panggil fungsi context
    navigate('/'); // Redirect ke halaman utama
  };

  return (
    <BookForm onSubmit={handleSubmit} isEditing={false} />
  );
};

export default AddBookPage;