import { useState, useEffect, useCallback } from 'react';
import { getAllStock, addProduct, updateStock } from '../services/inventoryService';

export function useInventory() {
  const [inventory, setInventory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchInventory = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getAllStock();
      setInventory(data);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchInventory();
  }, [fetchInventory]);

  const addNewProduct = async (productData) => {
    try {
      await addProduct(productData);
      await fetchInventory();
      return { success: true };
    } catch (err) {
      return { success: false, error: err };
    }
  };

  const updateProductStock = async (stockData) => {
    try {
      await updateStock(stockData);
      await fetchInventory();
      return { success: true };
    } catch (err) {
      return { success: false, error: err };
    }
  };

  return { inventory, loading, error, addNewProduct, updateProductStock, refreshInventory: fetchInventory };
}