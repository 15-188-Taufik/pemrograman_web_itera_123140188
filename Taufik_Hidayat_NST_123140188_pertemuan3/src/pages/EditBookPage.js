import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useBooks } from '../context/BookContext';
import BookForm from '../components/BookForm/BookForm';

const EditBookPage = () => {
  const { id } = useParams(); // Dapatkan 'id' dari URL (cth: /edit/123)
  const { books, updateBook } = useBooks();
  const navigate = useNavigate();

  // Cari buku yang akan diedit berdasarkan ID.
  // Konversi ID dari string ke angka jika perlu (tergantung ID Anda)
  // ID kita dari Date.now() adalah angka, jadi kita konversi
  const bookToEdit = books.find(book => book.id === Number(id));

  const handleSubmit = (formData) => {
    updateBook(Number(id), formData); // Panggil fungsi context
    navigate('/'); // Redirect ke halaman utama
  };

  // Jika buku tidak ditemukan (mis: ID salah di URL), tampilkan pesan
  if (!bookToEdit) {
    return (
      <div style={{ textAlign: 'center', marginTop: '40px' }}>
        <h2>Book Not Found</h2>
        <p>The book you are trying to edit does not exist.</p>
      </div>
    );
  }

  return (
    <BookForm 
      onSubmit={handleSubmit} 
      isEditing={true} 
      initialData={bookToEdit} 
    />
  );
};

export default EditBookPage;