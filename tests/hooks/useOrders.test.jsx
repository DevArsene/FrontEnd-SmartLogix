import '@testing-library/jest-dom';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { useState } from 'react';
import { vi } from 'vitest';

vi.mock('../../src/services/orderService.js', () => ({
  getAllOrders: vi.fn(),
  createOrderViaBff: vi.fn(),
}));

import { useOrders } from '../../src/hooks/useOrders.js';
import { getAllOrders, createOrderViaBff } from '../../src/services/orderService.js';

function OrdersHookTester() {
  const { orders, loading, error, placeOrder } = useOrders();
  const [result, setResult] = useState(null);

  if (loading) return <div>Loading</div>;
  if (error) return <div>Error</div>;

  return (
    <div>
      {orders.map(order => <span key={order.id}>{order.productoCodigo}</span>)}
      <button onClick={async () => setResult(await placeOrder('VENTA', 'P1', 4))}>Place</button>
      {result && <div>{result.success ? 'OK' : 'FAIL'}</div>}
    </div>
  );
}

describe('useOrders', () => {
  beforeEach(() => {
    getAllOrders.mockResolvedValue([{ id: 1, productoCodigo: 'PROD_O', cantidad: 2, estado: 'PENDIENTE' }]);
    createOrderViaBff.mockResolvedValue({});
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('carga los pedidos y muestra los productos', async () => {
    render(<OrdersHookTester />);

    expect(screen.getByText('Loading')).toBeInTheDocument();
    await waitFor(() => expect(screen.getByText('PROD_O')).toBeInTheDocument());
    expect(getAllOrders).toHaveBeenCalledTimes(1);
  });

  it('muestra el error cuando la carga de pedidos falla', async () => {
    getAllOrders.mockRejectedValueOnce(new Error('fallo de red'));

    render(<OrdersHookTester />);

    await waitFor(() => expect(screen.getByText('Error')).toBeInTheDocument());
    expect(getAllOrders.mock.calls.length).toBeGreaterThanOrEqual(1);
  });

  it('coloca un pedido y refresca la lista', async () => {
    getAllOrders.mockResolvedValueOnce([{ id: 1, productoCodigo: 'PROD_O', cantidad: 2, estado: 'PENDIENTE' }]);
    getAllOrders.mockResolvedValueOnce([{ id: 1, productoCodigo: 'PROD_O', cantidad: 2, estado: 'PENDIENTE' }, { id: 2, productoCodigo: 'P1', cantidad: 4, estado: 'PENDIENTE' }]);

    render(<OrdersHookTester />);
    await waitFor(() => expect(screen.getByText('PROD_O')).toBeInTheDocument());

    fireEvent.click(screen.getByRole('button', { name: /place/i }));

    await waitFor(() => expect(screen.getByText('OK')).toBeInTheDocument());
    expect(createOrderViaBff).toHaveBeenCalledWith('VENTA', 'P1', 4);
    expect(getAllOrders.mock.calls.length).toBeGreaterThanOrEqual(2);
  });
});
