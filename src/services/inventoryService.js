const BASE_URL = import.meta.env.VITE_INVENTORY_API_URL; // http://localhost:8082/api

// GET - todos
export const getAllStock = async () => {
  const res = await fetch(`${BASE_URL}/inventory/all`);
  if (!res.ok) throw new Error('Error al obtener inventario');
  return res.json();
};

// GET - por producto y almacén
export const getStock = async (productoCodigo, almacenCodigo) => {
  const res = await fetch(`${BASE_URL}/inventory/${productoCodigo}/${almacenCodigo}`);
  if (!res.ok) throw new Error('Stock no encontrado');
  return res.json();
};

// POST - agregar uno
export const addProduct = async (inventory) => {
  const res = await fetch(`${BASE_URL}/inventory/add`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(inventory),
  });
  if (!res.ok) throw new Error('Error al agregar producto');
  return res.json();
};

// POST - agregar varios
export const addProducts = async (products) => {
  const res = await fetch(`${BASE_URL}/inventory/bulk-add`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(products),
  });
  if (!res.ok) throw new Error('Error al agregar productos');
  return res.json();
};

// POST - actualizar stock
export const updateStock = async (inventory) => {
  const res = await fetch(`${BASE_URL}/inventory/update`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(inventory),
  });
  if (!res.ok) throw new Error('Error al actualizar stock');
  return res.json();
};