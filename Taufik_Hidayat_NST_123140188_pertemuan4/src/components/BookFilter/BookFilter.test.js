// src/components/BookFilter/BookFilter.test.js

import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import BookFilter from './BookFilter';

describe('BookFilter Component', () => {

  // Tes 1: Memastikan semua tombol filter ter-render
  test('renders all filter buttons', () => {
    render(<BookFilter currentFilter="All" onFilterChange={() => {}} />);

    // 'screen.getByText' akan mencari teks di dalam dokumen
    expect(screen.getByText('All')).toBeInTheDocument();
    expect(screen.getByText('Owned')).toBeInTheDocument();
    expect(screen.getByText('Reading')).toBeInTheDocument();
    expect(screen.getByText('Wishlist')).toBeInTheDocument();
  });

  // Tes 2: Memastikan filter yang aktif memiliki kelas 'active'
  test('highlights the active filter', () => {
    const activeFilter = 'Reading';
    render(<BookFilter currentFilter={activeFilter} onFilterChange={() => {}} />);

    const readingButton = screen.getByText('Reading');
    const allButton = screen.getByText('All');

    // 'readingButton' harus punya kelas 'active'
    expect(readingButton).toHaveClass('active');
    
    // 'allButton' tidak boleh punya kelas 'active'
    expect(allButton).not.toHaveClass('active');
  });

  // Tes 3: Memastikan memanggil onFilterChange saat diklik
  test('calls onFilterChange handler when a filter is clicked', () => {
    // jest.fn() adalah fungsi mock (palsu) untuk melacak panggilan
    const mockOnFilterChange = jest.fn();
    
    render(<BookFilter currentFilter="All" onFilterChange={mockOnFilterChange} />);

    // Temukan tombol 'Owned'
    const ownedButton = screen.getByText('Owned');

    // 'fireEvent.click' mensimulasikan klik pengguna
    fireEvent.click(ownedButton);

    // Kita harapkan fungsi mock kita dipanggil satu kali
    expect(mockOnFilterChange).toHaveBeenCalledTimes(1);
    
    // Dan dipanggil dengan argumen yang benar ('Owned')
    expect(mockOnFilterChange).toHaveBeenCalledWith('Owned');
  });
});