import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Package, ShoppingCart } from 'lucide-react';

export default function Navbar() {
  const location = useLocation();

  const getLinkClass = (path) => {
    return location.pathname === path ? 'nav-link active' : 'nav-link';
  };

  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <h2>SmartLogix</h2>
      </div>
      <div className="navbar-links">
        <Link to="/" className={getLinkClass('/')}>
          <Package size={20} />
          <span>Inventario</span>
        </Link>
        <Link to="/orders" className={getLinkClass('/orders')}>
          <ShoppingCart size={20} />
          <span>Pedidos</span>
        </Link>
      </div>
    </nav>
  );
}