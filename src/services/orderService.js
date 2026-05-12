const BASE_BFF_URL = import.meta.env.VITE_API_BASE_URL; 
const BASE_ORDERS_URL = import.meta.env.VITE_ORDERS_API_URL;

export const createOrderViaBff = async (tipo, codigoProducto, cantidad) => {
  // Asegúrate de que tu BFF realmente tenga esta ruta
  const url = `${BASE_BFF_URL}/bff/checkout?tipo=${encodeURIComponent(tipo)}&codigoProducto=${encodeURIComponent(codigoProducto)}&cantidad=${encodeURIComponent(cantidad)}`;
  const res = await fetch(url, { method: 'POST' });
  if (!res.ok) throw new Error('Error en BFF');
  return res.json();
};

export const getAllOrders = async () => {
  // QUITAMOS el "/orders" extra porque ya viene en la variable
  const res = await fetch(`${BASE_ORDERS_URL}/all`); 
  if (!res.ok) throw new Error('Error al obtener pedidos');
  return res.json();
};