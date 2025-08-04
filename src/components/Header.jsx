// Path: src/components/Header.jsx
// This is the new, professional header for your application.

import React from 'react';
import './Header.css'; // We will use its CSS file

const Header = () => {
  return (
    <header className="app-header">
      <div className="header-content">
        <h1>🔬 CSI Vision</h1>
        <p>Human Activity Analysis via WiFi & Image</p>
      </div>
    </header>
  );
};

export default Header;