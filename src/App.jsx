import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import InventoryPage from './pages/InventoryPage';
import OrdersPage from './pages/OrdersPage';
import { useTheme } from './hooks/useTheme';
import './App.css';

function App() {
  const { theme, toggleTheme } = useTheme();

  return (
    <div className="app-layout">
      <Navbar theme={theme} onToggle={toggleTheme} />
      <main className="main-content">
        <Routes>
          <Route path="/" element={<InventoryPage />} />
          <Route path="/orders" element={<OrdersPage />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;