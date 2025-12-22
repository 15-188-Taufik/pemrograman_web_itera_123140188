// src/components/BookForm/BookForm.test.js

import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { MemoryRouter } from 'react-router-dom'; // Import MemoryRouter
import BookForm from './BookForm';

// Helper function untuk me-render komponen dengan Router
const renderWithRouter = (component) => {
  return render(<MemoryRouter>{component}</MemoryRouter>);
};

describe('BookForm Component', () => {
  
  // Tes 4: Menampilkan error validasi
  test('shows validation errors for empty title and author', async () => {
    const mockOnSubmit = jest.fn();
    renderWithRouter(<BookForm onSubmit={mockOnSubmit} />);

    // Temukan tombol submit (berdasarkan rolenya)
    const submitButton = screen.getByRole('button', { name: /Add Book/i });

    // Klik tombol tanpa mengisi form
    fireEvent.click(submitButton);

    // Kita gunakan 'findByText' karena pesan error mungkin muncul
    // secara asinkron (meskipun di sini sinkron)
    // 'await' memastikan kita menunggu pesan error muncul
    expect(await screen.findByText('Title is required')).toBeInTheDocument();
    expect(await screen.findByText('Author is required')).toBeInTheDocument();

    // Pastikan onSubmit TIDAK dipanggil
    expect(mockOnSubmit).not.toHaveBeenCalled();
  });

  // Tes 5: Mengirimkan data yang valid saat submit
  test('calls onSubmit with form data when valid', async () => {
    const mockOnSubmit = jest.fn();
    renderWithRouter(<BookForm onSubmit={mockOnSubmit} />);

    // Simulasikan pengguna mengetik di input
    // 'getByLabelText' adalah cara terbaik untuk menemukan input
    fireEvent.change(screen.getByLabelText(/Book Title/i), {
      target: { value: 'Dune' },
    });

    fireEvent.change(screen.getByLabelText(/Author/i), {
      target: { value: 'Frank Herbert' },
    });

    // Simulasikan pengguna memilih status
    fireEvent.change(screen.getByLabelText(/Status/i), {
      target: { value: 'Reading' },
    });

    // Klik tombol submit
    const submitButton = screen.getByRole('button', { name: /Add Book/i });
    fireEvent.click(submitButton);

    // 'waitFor' berguna untuk menunggu state update selesai
    await waitFor(() => {
      // Pastikan onSubmit DIPANGGIL
      expect(mockOnSubmit).toHaveBeenCalledTimes(1);
      
      // Pastikan dipanggil dengan data yang benar
      expect(mockOnSubmit).toHaveBeenCalledWith({
        title: 'Dune',
        author: 'Frank Herbert',
        status: 'Reading',
      });
    });

    // Pastikan tidak ada pesan error yang muncul
    expect(screen.queryByText('Title is required')).not.toBeInTheDocument();
    expect(screen.queryByText('Author is required')).not.toBeInTheDocument();
  });
});