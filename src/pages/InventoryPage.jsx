import React, { useState } from 'react';
import { useInventory } from '../hooks/useInventory';
import Card from '../components/Card';
import Button from '../components/Button';
import Modal from '../components/Modal';
import { Plus, Edit2 } from 'lucide-react';

export default function InventoryPage() {
  const { inventory, loading, error, addNewProduct, updateProductStock } = useInventory();
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  
  const [formData, setFormData] = useState({ productoCodigo: '', almacenCodigo: '', stock: 0 });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: name === 'stock' ? parseInt(value) || 0 : value }));
  };

  const handleAddSubmit = async (e) => {
    e.preventDefault();
    await addNewProduct(formData);
    setIsAddModalOpen(false);
    setFormData({ productoCodigo: '', almacenCodigo: '', stock: 0 });
  };

  const handleUpdateSubmit = async (e) => {
    e.preventDefault();
    await updateProductStock(formData);
    setIsUpdateModalOpen(false);
    setFormData({ productoCodigo: '', almacenCodigo: '', stock: 0 });
  };

  const openUpdateModal = (item) => {
    setFormData({ productoCodigo: item.productoCodigo, almacenCodigo: item.almacenCodigo, stock: item.stock });
    setIsUpdateModalOpen(true);
  };

  if (loading) return <div className="loading-state">Cargando inventario...</div>;
  if (error) return <div className="error-state">Error: {error.message}</div>;

  return (
    <div className="page-container">
      <div className="page-header">
        <h1>Gestión de Inventario</h1>
        <Button onClick={() => setIsAddModalOpen(true)}>
          <Plus size={16} style={{ marginRight: '8px' }}/>
          Nuevo Producto
        </Button>
      </div>

      <Card title="Listado de Stock en Almacenes">
        <table className="data-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Código Producto</th>
              <th>Código Almacén</th>
              <th>Stock Disponible</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {inventory.length === 0 && (
              <tr>
                <td colSpan="5" className="text-center">No hay productos en el inventario.</td>
              </tr>
            )}
            {inventory.map(item => (
              <tr key={item.id || `${item.productoCodigo}-${item.almacenCodigo}`}>
                <td>{item.id || '-'}</td>
                <td><span className="badge">{item.productoCodigo}</span></td>
                <td>{item.almacenCodigo}</td>
                <td>
                  <span className={`stock-indicator ${item.stock < 10 ? 'low' : 'good'}`}>
                    {item.stock}
                  </span>
                </td>
                <td>
                  <Button variant="secondary" onClick={() => openUpdateModal(item)}>
                    <Edit2 size={14} />
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>

      <Modal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} title="Agregar Nuevo Producto">
        <form onSubmit={handleAddSubmit} className="form-layout">
          <div className="form-group">
            <label>Código Producto</label>
            <input type="text" name="productoCodigo" value={formData.productoCodigo} onChange={handleInputChange} required />
          </div>
          <div className="form-group">
            <label>Código Almacén</label>
            <input type="text" name="almacenCodigo" value={formData.almacenCodigo} onChange={handleInputChange} required />
          </div>
          <div className="form-group">
            <label>Stock Inicial</label>
            <input type="number" name="stock" value={formData.stock} onChange={handleInputChange} min="0" required />
          </div>
          <div className="form-actions">
            <Button type="submit">Guardar Producto</Button>
          </div>
        </form>
      </Modal>

      <Modal isOpen={isUpdateModalOpen} onClose={() => setIsUpdateModalOpen(false)} title="Actualizar Stock">
        <form onSubmit={handleUpdateSubmit} className="form-layout">
          <div className="form-group">
            <label>Código Producto</label>
            <input type="text" name="productoCodigo" value={formData.productoCodigo} disabled />
          </div>
          <div className="form-group">
            <label>Código Almacén</label>
            <input type="text" name="almacenCodigo" value={formData.almacenCodigo} disabled />
          </div>
          <div className="form-group">
            <label>Nuevo Stock</label>
            <input type="number" name="stock" value={formData.stock} onChange={handleInputChange} min="0" required />
          </div>
          <div className="form-actions">
            <Button type="submit">Actualizar Stock</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}