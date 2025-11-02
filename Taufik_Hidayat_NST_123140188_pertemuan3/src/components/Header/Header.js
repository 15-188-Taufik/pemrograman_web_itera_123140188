// src/components/Header/Header.js

import React from 'react';
import { NavLink } from 'react-router-dom';
import './Header.css';

const Header = () => {
  return (
    <header className="app-header">
      <div className="header-content">
        <h1 className="header-title">My Books</h1>
        <nav className="header-nav">
          <NavLink 
            to="/" 
            className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}
            end 
            // 'end' prop penting agar tidak 'active' saat di /add
          >
            Home
          </NavLink>
          <NavLink 
            to="/add" 
            className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}
          >
            Add Book
          </NavLink>
          <NavLink 
            to="/about" 
            className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}
          >
            About
          </NavLink>
        </nav>
      </div>
    </header>
  );
};

export default Header;