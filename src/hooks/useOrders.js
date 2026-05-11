import { useState, useEffect, useCallback } from 'react';
import { getAllOrders, createOrderViaBff } from '../services/orderService';

export function useOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchOrders = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getAllOrders();
      setOrders(data);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  const placeOrder = async (tipo, codigoProducto, cantidad) => {
    try {
      await createOrderViaBff(tipo, codigoProducto, cantidad);
      await fetchOrders(); // Refresh after placing order
      return { success: true };
    } catch (err) {
      return { success: false, error: err };
    }
  };

  return { orders, loading, error, placeOrder, refreshOrders: fetchOrders };
}
