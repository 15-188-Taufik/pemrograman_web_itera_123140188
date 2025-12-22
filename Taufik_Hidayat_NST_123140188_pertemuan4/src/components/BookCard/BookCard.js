// src/components/BookCard/BookCard.js

import React from 'react';
import { Link } from 'react-router-dom';
import { useBooks } from '../../context/BookContext'; // Impor context untuk 'deleteBook'
import './BookCard.css';

const BookCard = ({ book }) => {
  const { deleteBook } = useBooks();

  const getStatusClass = (status) => {
    switch (status) {
      case 'Owned': return 'status-owned';
      case 'Reading': return 'status-reading';
      case 'Wishlist': return 'status-wishlist';
      default: return '';
    }
  };

  return (
    // Kita gunakan kelas 'card' global dari App.css
    <div className="book-card card">
      <div className="book-info">
        <h3 className="book-title">{book.title}</h3>
        <p className="book-author">{book.author}</p>
      </div>
      <div className="book-status-actions">
        <span className={`book-status ${getStatusClass(book.status)}`}>
          {book.status}
        </span>
        <div className="book-actions">
          <Link to={`/edit/${book.id}`} className="action-btn edit-btn">
            Edit
          </Link>
          <button 
            onClick={() => deleteBook(book.id)} 
            className="action-btn delete-btn"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

export default BookCard;