import React, { useState } from 'react';
import { useOrders } from '../hooks/useOrders';
import Card from '../components/Card';
import Button from '../components/Button';
import Modal from '../components/Modal';
import { Plus } from 'lucide-react';

export default function OrdersPage() {
  const { orders, loading, error, placeOrder } = useOrders();
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const [formData, setFormData] = useState({
    numeroPedido: '',
    productoCodigo: '',
    cantidad: 1,
    almacenCodigo: '',
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'cantidad' ? parseInt(value) || 1 : value,
    }));
  };

  const handleAddSubmit = async (e) => {
    e.preventDefault();
    await placeOrder(formData);
    setIsAddModalOpen(false);
    setFormData({ numeroPedido: '', productoCodigo: '', cantidad: 1, almacenCodigo: '' });
  };

  const getStatusClass = (estado) => {
    switch (estado) {
      case 'COMPLETADO': return 'success';
      case 'PENDIENTE':  return 'pending';
      default:           return 'pending';
    }
  };

  if (loading) return <div className="loading-state">Cargando pedidos...</div>;
  if (error)   return <div className="error-state">Error: {error.message}</div>;

  return (
    <div className="page-container">
      <div className="page-header">
        <h1>Gestión de <span>Pedidos</span></h1>
        <Button onClick={() => setIsAddModalOpen(true)}>
          <Plus size={16} />
          Nuevo Pedido
        </Button>
      </div>

      <Card title="Historial de Pedidos">
        <table className="data-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Nº Pedido</th>
              <th>Cód. Producto</th>
              <th>Cód. Almacén</th>
              <th>Cantidad</th>
              <th>Estado</th>
            </tr>
          </thead>
          <tbody>
            {orders.length === 0 && (
              <tr>
                <td colSpan="6" className="text-center">No hay pedidos registrados.</td>
              </tr>
            )}
            {orders.map(order => (
              <tr key={order.id}>
                <td style={{ color: 'var(--text-dim)', fontFamily: 'var(--font-mono)' }}>
                  #{order.id}
                </td>
                <td>
                  <span className="badge">{order.numeroPedido}</span>
                </td>
                <td style={{ fontFamily: 'var(--font-mono)' }}>
                  {order.productoCodigo}
                </td>
                <td style={{ fontFamily: 'var(--font-mono)' }}>
                  {order.almacenCodigo}
                </td>
                <td>{order.cantidad}</td>
                <td>
                  <span className={`status-indicator ${getStatusClass(order.estado)}`}>
                    {order.estado ?? 'PENDIENTE'}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>

      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="Crear Nuevo Pedido"
      >
        <form onSubmit={handleAddSubmit} className="form-layout">
          <div className="form-group">
            <label>Número de Pedido</label>
            <input
              type="text"
              name="numeroPedido"
              value={formData.numeroPedido}
              onChange={handleInputChange}
              placeholder="Ej: PED-2024-001"
              required
            />
          </div>
          <div className="form-group">
            <label>Código de Producto</label>
            <input
              type="text"
              name="productoCodigo"
              value={formData.productoCodigo}
              onChange={handleInputChange}
              placeholder="Ej: PROD-001"
              required
            />
          </div>
          <div className="form-group">
            <label>Código de Almacén</label>
            <input
              type="text"
              name="almacenCodigo"
              value={formData.almacenCodigo}
              onChange={handleInputChange}
              placeholder="Ej: ALM-01"
              required
            />
          </div>
          <div className="form-group">
            <label>Cantidad</label>
            <input
              type="number"
              name="cantidad"
              value={formData.cantidad}
              onChange={handleInputChange}
              min="1"
              required
            />
          </div>
          <div className="form-actions">
            <Button type="button" className="btn btn-secondary" onClick={() => setIsAddModalOpen(false)}>
              Cancelar
            </Button>
            <Button type="submit">Procesar Pedido</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}