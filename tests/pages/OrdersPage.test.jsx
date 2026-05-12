import '@testing-library/jest-dom';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { vi } from 'vitest';

vi.mock('../../src/hooks/useOrders.js', () => ({ useOrders: vi.fn() }));

import OrdersPage from '../../src/pages/OrdersPage.jsx';
import { useOrders } from '../../src/hooks/useOrders.js';

describe('OrdersPage', () => {
  beforeEach(() => {
    useOrders.mockReturnValue({
      orders: [],
      loading: false,
      error: null,
      placeOrder: vi.fn(),
    });
  });

  it('muestra el mensaje de pedidos vacío cuando no hay pedidos', () => {
    render(<OrdersPage />);

    expect(screen.getByText('Gestión de Pedidos')).toBeInTheDocument();
    expect(screen.getByText('No hay pedidos registrados.')).toBeInTheDocument();
  });

  it('muestra el mensaje de carga mientras los pedidos se cargan', () => {
    useOrders.mockReturnValue({
      orders: [],
      loading: true,
      error: null,
      placeOrder: vi.fn(),
    });

    render(<OrdersPage />);

    expect(screen.getByText('Cargando pedidos...')).toBeInTheDocument();
  });

  it('muestra el mensaje de error cuando ocurre un problema al cargar pedidos', () => {
    useOrders.mockReturnValue({
      orders: [],
      loading: false,
      error: new Error('No disponible'),
      placeOrder: vi.fn(),
    });

    render(<OrdersPage />);

    expect(screen.getByText('Error: No disponible')).toBeInTheDocument();
  });

  it('llama a placeOrder cuando se envía el formulario de pedido', async () => {
    const placeOrder = vi.fn().mockResolvedValue({ success: true });

    useOrders.mockReturnValue({
      orders: [],
      loading: false,
      error: null,
      placeOrder,
    });

    render(<OrdersPage />);

    fireEvent.click(screen.getByRole('button', { name: /nuevo pedido/i }));
    const textboxes = screen.getAllByRole('textbox');
    fireEvent.change(textboxes[0], { target: { value: 'VENTA' } });
    fireEvent.change(textboxes[1], { target: { value: 'P1' } });
    fireEvent.change(screen.getByRole('spinbutton'), { target: { value: '4' } });

    fireEvent.click(screen.getByRole('button', { name: /procesar pedido/i }));

    await waitFor(() => expect(placeOrder).toHaveBeenCalledWith('VENTA', 'P1', 4));
  });

  it('muestra los pedidos en la tabla cuando hay pedidos', () => {
    useOrders.mockReturnValue({
      orders: [
        { id: 100, tipo: 'VENTA', productoCodigo: 'PROD2', cantidad: 5, estado: 'COMPLETADO' },
      ],
      loading: false,
      error: null,
      placeOrder: vi.fn(),
    });

    render(<OrdersPage />);

    expect(screen.getByText('PROD2')).toBeInTheDocument();
    expect(screen.getByText('VENTA')).toBeInTheDocument();
    expect(screen.getByText('5')).toBeInTheDocument();
    expect(screen.getByText('COMPLETADO')).toBeInTheDocument();
  });
});
