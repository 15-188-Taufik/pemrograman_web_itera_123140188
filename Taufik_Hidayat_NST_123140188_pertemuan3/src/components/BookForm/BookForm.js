// src/components/BookForm/BookForm.js

import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './BookForm.css';

const BookForm = ({ onSubmit, initialData = null, isEditing = false }) => {
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [status, setStatus] = useState('Wishlist'); // Default status
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  // useEffect untuk mengisi form jika ini adalah mode edit
  useEffect(() => {
    if (isEditing && initialData) {
      setTitle(initialData.title);
      setAuthor(initialData.author);
      setStatus(initialData.status);
    }
  }, [isEditing, initialData]);

  // Fungsi validasi
  const validate = () => {
    const newErrors = {};
    if (!title) newErrors.title = 'Title is required';
    if (!author) newErrors.author = 'Author is required';
    return newErrors;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const validationErrors = validate();
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length === 0) {
      onSubmit({ title, author, status });
      // Navigasi akan ditangani di halaman (AddBookPage/EditBookPage)
    }
  };

  return (
    // Kita gunakan kelas 'card' dari App.css
    <form onSubmit={handleSubmit} className="book-form card">
      <h2>{isEditing ? 'Edit Book' : 'Add New Book'}</h2>

      <div className="form-group">
        <label htmlFor="title">Book Title</label>
        <input
          type="text"
          id="title"
          className={`form-input ${errors.title ? 'is-invalid' : ''}`}
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        {errors.title && <span className="form-error">{errors.title}</span>}
      </div>

      <div className="form-group">
        <label htmlFor="author">Author</label>
        <input
          type="text"
          id="author"
          className={`form-input ${errors.author ? 'is-invalid' : ''}`}
          value={author}
          onChange={(e) => setAuthor(e.target.value)}
        />
        {errors.author && <span className="form-error">{errors.author}</span>}
      </div>

      <div className="form-group">
        <label htmlFor="status">Status</label>
        <select
          id="status"
          className="form-select"
          value={status}
          onChange={(e) => setStatus(e.target.value)}
        >
          <option value="Wishlist">Wishlist</option>
          <option value="Reading">Reading</option>
          <option value="Owned">Owned</option>
        </select>
      </div>

      <div className="form-actions">
        <button type="submit" className="btn btn-primary">
          {isEditing ? 'Save Changes' : 'Add Book'}
        </button>
        {/* Link 'Cancel' kembali ke halaman utama */}
        <Link to="/" className="btn btn-link">
          Cancel
        </Link>
      </div>
    </form>
  );
};

export default BookForm;