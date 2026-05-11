import React, { useState } from 'react';
import { useOrders } from '../hooks/useOrders';
import Card from '../components/Card';
import Button from '../components/Button';
import Modal from '../components/Modal';
import { Plus } from 'lucide-react';

export default function OrdersPage() {
  const { orders, loading, error, placeOrder } = useOrders();
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  
  const [formData, setFormData] = useState({ tipo: '', codigoProducto: '', cantidad: 1 });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: name === 'cantidad' ? parseInt(value) || 1 : value }));
  };

  const handleAddSubmit = async (e) => {
    e.preventDefault();
    await placeOrder(formData.tipo, formData.codigoProducto, formData.cantidad);
    setIsAddModalOpen(false);
    setFormData({ tipo: '', codigoProducto: '', cantidad: 1 });
  };

  if (loading) return <div className="loading-state">Cargando pedidos...</div>;
  if (error) return <div className="error-state">Error: {error.message}</div>;

  return (
    <div className="page-container">
      <div className="page-header">
        <h1>Gestión de Pedidos</h1>
        <Button onClick={() => setIsAddModalOpen(true)}>
          <Plus size={16} style={{ marginRight: '8px' }}/>
          Nuevo Pedido
        </Button>
      </div>

      <Card title="Historial de Pedidos">
        <table className="data-table">
          <thead>
            <tr>
              <th>ID Pedido</th>
              <th>Tipo</th>
              <th>Código Producto</th>
              <th>Cantidad</th>
              <th>Estado</th>
            </tr>
          </thead>
          <tbody>
            {orders.length === 0 && (
              <tr>
                <td colSpan="5" className="text-center">No hay pedidos registrados.</td>
              </tr>
            )}
            {orders.map(order => (
              <tr key={order.id}>
                <td>{order.id}</td>
                <td><span className="badge">{order.tipo}</span></td>
                <td>{order.productoCodigo}</td>
                <td>{order.cantidad}</td>
                <td>
                  <span className={`status-indicator ${order.estado === 'COMPLETADO' ? 'success' : 'pending'}`}>
                    {order.estado || 'PENDIENTE'}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>

      <Modal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} title="Crear Nuevo Pedido">
        <form onSubmit={handleAddSubmit} className="form-layout">
          <div className="form-group">
            <label>Tipo de Pedido (Ej: VENTA, COMPRA)</label>
            <input type="text" name="tipo" value={formData.tipo} onChange={handleInputChange} required />
          </div>
          <div className="form-group">
            <label>Código Producto</label>
            <input type="text" name="codigoProducto" value={formData.codigoProducto} onChange={handleInputChange} required />
          </div>
          <div className="form-group">
            <label>Cantidad</label>
            <input type="number" name="cantidad" value={formData.cantidad} onChange={handleInputChange} min="1" required />
          </div>
          <div className="form-actions">
            <Button type="submit">Procesar Pedido</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}