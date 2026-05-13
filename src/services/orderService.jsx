const BASE_BFF_URL = import.meta.env.VITE_API_BASE_URL;
const BASE_ORDERS_URL = import.meta.env.VITE_ORDERS_API_URL;

export const createOrderViaBff = async (formData) => {
  const { numeroPedido, productoCodigo, cantidad, almacenCodigo } = formData;

  const params = new URLSearchParams({
    numeroPedido,
    productoCodigo,
    cantidad,
    almacenCodigo,
  });

  const url = `${BASE_BFF_URL}/bff/checkout?${params.toString()}`;
  console.log('[createOrderViaBff] POST →', url);

  const res = await fetch(url, { method: 'POST' });
  if (!res.ok) throw new Error(`Error en BFF: ${res.status}`);
  return res.json();
};

export const getAllOrders = async () => {
  const url = `${BASE_ORDERS_URL}/orders/all`;
  console.log('[getAllOrders] GET →', url);

  const res = await fetch(url);
  if (!res.ok) throw new Error(`Error al obtener pedidos: ${res.status}`);

  const data = await res.json();
  console.log('[getAllOrders] respuesta →', data);

  if (Array.isArray(data)) return data;
  if (Array.isArray(data.content)) return data.content;
  if (Array.isArray(data.data)) return data.data;

  console.warn('[getAllOrders] formato inesperado:', data);
  return [];
};