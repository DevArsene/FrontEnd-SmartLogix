const BASE_BFF_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api/auth'; // Assuming BFF is on the same base URL as auth service, adjust if needed
const BASE_ORDERS_URL = import.meta.env.VITE_ORDERS_API_URL || 'http://localhost:8081/api/orders';

// POST - create order via BFF
export const createOrderViaBff = async (tipo, codigoProducto, cantidad) => {
  const url = `${BASE_BFF_URL}/bff/checkout?tipo=${encodeURIComponent(tipo)}&codigoProducto=${encodeURIComponent(codigoProducto)}&cantidad=${encodeURIComponent(cantidad)}`;
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
  });
  if (!res.ok) throw new Error('Error al crear el pedido a través del BFF');
  const text = await res.text();
  try {
    return JSON.parse(text);
  } catch(e) {
    return text;
  }
};

// GET - all orders directly from orders service (if BFF doesn't expose it)
export const getAllOrders = async () => {
  const res = await fetch(`${BASE_ORDERS_URL}/orders/all`);
  if (!res.ok) throw new Error('Error al obtener los pedidos');
  return res.json();
};
