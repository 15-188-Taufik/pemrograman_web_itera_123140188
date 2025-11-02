// src/hooks/useLocalStorage.js

import { useState, useEffect } from 'react';

// Fungsi helper untuk mendapatkan nilai dari localStorage dengan aman
function getStorageValue(key, defaultValue) {
  // Cek apakah window (browser) tersedia
  if (typeof window !== "undefined") {
    const saved = localStorage.getItem(key);
    try {
      // Coba parse JSON, jika tidak ada, kembalikan defaultValue
      return saved ? JSON.parse(saved) : defaultValue;
    } catch (e) {
      console.error("Failed to parse localStorage value", e);
      return defaultValue;
    }
  }
  return defaultValue;
}

export const useLocalStorage = (key, defaultValue) => {
  const [value, setValue] = useState(() => {
    return getStorageValue(key, defaultValue);
  });

  useEffect(() => {
    // Setiap kali 'value' berubah, simpan ke localStorage
    localStorage.setItem(key, JSON.stringify(value));
  }, [key, value]); // Hanya jalankan jika key atau value berubah

  return [value, setValue];
};