import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Package, ShoppingCart, Moon, Sun } from 'lucide-react';

export default function Navbar() {
  const location = useLocation();

  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('theme') || 'dark';
  });

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  const getLinkClass = (path) =>
    location.pathname === path ? 'nav-link active' : 'nav-link';

  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <h2>SmartLogix</h2>
      </div>
      <div className="navbar-links">
        <Link to="/" className={getLinkClass('/')}>
          <Package size={16} />
          <span>Inventario</span>
        </Link>
        <Link to="/orders" className={getLinkClass('/orders')}>
          <ShoppingCart size={16} />
          <span>Pedidos</span>
        </Link>

        <div className="theme-toggle">
          <button
            className={`theme-toggle-btn ${theme === 'dark' ? 'active' : ''}`}
            onClick={() => setTheme('dark')}
            aria-label="Modo oscuro"
            title="Modo oscuro"
          >
            <Moon size={14} />
          </button>
          <button
            className={`theme-toggle-btn ${theme === 'light' ? 'active' : ''}`}
            onClick={() => setTheme('light')}
            aria-label="Modo claro"
            title="Modo claro"
          >
            <Sun size={14} />
          </button>
        </div>
      </div>
    </nav>
  );
}