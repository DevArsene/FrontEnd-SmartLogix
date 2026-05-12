// 1. Extraemos las URLs del .env
// VITE_API_BASE_URL ahora vale http://localhost:8082/api/inventory
const INVENTORY_URL = import.meta.env.VITE_API_BASE_URL; 
const ORDERS_URL = import.meta.env.VITE_ORDERS_API_URL;

// GET - todos
export const getAllStock = async () => {
  // Resultado: http://localhost:8082/api/inventory/all
  const res = await fetch(`${INVENTORY_URL}/all`); 
  if (!res.ok) throw new Error('Error al obtener inventario');
  return res.json();
};

// GET - por producto y almacén
export const getStock = async (productoCodigo, almacenCodigo) => {
  // Resultado: http://localhost:8082/api/inventory/PROD01/ALM01
  const res = await fetch(`${INVENTORY_URL}/${productoCodigo}/${almacenCodigo}`);
  if (!res.ok) throw new Error('Stock no encontrado');
  return res.json();
};

// POST - agregar uno
export const addProduct = async (inventory) => {
  const res = await fetch(`${INVENTORY_URL}/add`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(inventory),
  });
  if (!res.ok) throw new Error('Error al agregar producto');
  return res.json();
};

// POST - actualizar stock
export const updateStock = async (inventory) => {
  const res = await fetch(`${INVENTORY_URL}/update`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(inventory),
  });
  if (!res.ok) throw new Error('Error al actualizar stock');
  return res.json();
};