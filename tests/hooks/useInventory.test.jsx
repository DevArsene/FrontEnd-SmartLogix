import '@testing-library/jest-dom';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { useState } from 'react';
import { vi } from 'vitest';

vi.mock('../../src/services/inventoryService.js', () => ({
  getAllStock: vi.fn(),
  addProduct: vi.fn(),
  updateStock: vi.fn(),
}));

import { useInventory } from '../../src/hooks/useInventory.js';
import { getAllStock, addProduct, updateStock } from '../../src/services/inventoryService.js';

function InventoryHookTester() {
  const { inventory, loading, error, addNewProduct, updateProductStock } = useInventory();
  const [result, setResult] = useState(null);

  if (loading) return <div>Loading</div>;
  if (error) return <div>Error</div>;

  return (
    <div>
      {inventory.map(item => <span key={item.productoCodigo}>{item.productoCodigo}</span>)}
      <button onClick={async () => setResult(await addNewProduct({ productoCodigo: 'P2', almacenCodigo: 'ALM2', stock: 5 }))}>
        Add
      </button>
      <button onClick={async () => setResult(await updateProductStock({ productoCodigo: 'P2', almacenCodigo: 'ALM2', stock: 10 }))}>
        Update
      </button>
      {result && <div>{result.success ? 'OK' : 'FAIL'}</div>}
    </div>
  );
}

describe('useInventory', () => {
  beforeEach(() => {
    getAllStock.mockResolvedValue([{ productoCodigo: 'PROD_X', almacenCodigo: 'ALM_X', stock: 20 }]);
    addProduct.mockResolvedValue({});
    updateStock.mockResolvedValue({});
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('carga el inventario y muestra los productos', async () => {
    render(<InventoryHookTester />);

    expect(screen.getByText('Loading')).toBeInTheDocument();
    await waitFor(() => expect(screen.getByText('PROD_X')).toBeInTheDocument());
    expect(getAllStock).toHaveBeenCalledTimes(1);
  });

  it('muestra el error cuando la carga falla', async () => {
    getAllStock.mockRejectedValueOnce(new Error('fallo de red'));

    render(<InventoryHookTester />);

    await waitFor(() => expect(screen.getByText('Error')).toBeInTheDocument());
    expect(getAllStock.mock.calls.length).toBeGreaterThanOrEqual(1);
  });

  it('agrega un nuevo producto y refresca el inventario', async () => {
    getAllStock.mockResolvedValueOnce([{ productoCodigo: 'PROD_X', almacenCodigo: 'ALM_X', stock: 20 }]);
    getAllStock.mockResolvedValueOnce([{ productoCodigo: 'PROD_X', almacenCodigo: 'ALM_X', stock: 20 }, { productoCodigo: 'P2', almacenCodigo: 'ALM2', stock: 5 }]);

    render(<InventoryHookTester />);
    await waitFor(() => expect(screen.getByText('PROD_X')).toBeInTheDocument());

    fireEvent.click(screen.getByRole('button', { name: /add/i }));

    await waitFor(() => expect(screen.getByText('OK')).toBeInTheDocument());
    expect(addProduct).toHaveBeenCalledWith({ productoCodigo: 'P2', almacenCodigo: 'ALM2', stock: 5 });
    expect(getAllStock.mock.calls.length).toBeGreaterThanOrEqual(2);
  });

  it('actualiza el stock y refresca el inventario', async () => {
    getAllStock.mockResolvedValueOnce([{ productoCodigo: 'PROD_X', almacenCodigo: 'ALM_X', stock: 20 }]);
    getAllStock.mockResolvedValueOnce([{ productoCodigo: 'PROD_X', almacenCodigo: 'ALM_X', stock: 20 }, { productoCodigo: 'P2', almacenCodigo: 'ALM2', stock: 10 }]);

    render(<InventoryHookTester />);
    await waitFor(() => expect(screen.getByText('PROD_X')).toBeInTheDocument());

    fireEvent.click(screen.getByRole('button', { name: /update/i }));

    await waitFor(() => expect(screen.getByText('OK')).toBeInTheDocument());
    expect(updateStock).toHaveBeenCalledWith({ productoCodigo: 'P2', almacenCodigo: 'ALM2', stock: 10 });
    expect(getAllStock.mock.calls.length).toBeGreaterThanOrEqual(2);
  });
});
