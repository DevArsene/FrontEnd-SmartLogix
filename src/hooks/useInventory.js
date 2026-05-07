import { useState, useEffect } from 'react';
import { getAllStock } from '../services/inventoryService';

export function useInventory() {
  const [inventory, setInventory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    getAllStock()
      .then(setInventory)
      .catch(setError)
      .finally(() => setLoading(false));
  }, []);

  return { inventory, loading, error };
}