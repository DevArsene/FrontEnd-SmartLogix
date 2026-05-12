import '@testing-library/jest-dom';
import { render, screen, fireEvent, waitFor, within } from '@testing-library/react';
import { vi } from 'vitest';

vi.mock('../../src/hooks/useInventory.js', () => ({ useInventory: vi.fn() }));

import InventoryPage from '../../src/pages/InventoryPage.jsx';
import { useInventory } from '../../src/hooks/useInventory.js';

describe('InventoryPage', () => {
  beforeEach(() => {
    useInventory.mockReturnValue({
      inventory: [],
      loading: false,
      error: null,
      addNewProduct: vi.fn(),
      updateProductStock: vi.fn(),
    });
  });

  it('muestra el mensaje de inventario vacío cuando no hay productos', () => {
    render(<InventoryPage />);

    expect(screen.getByText('Gestión de Inventario')).toBeInTheDocument();
    expect(screen.getByText('No hay productos en el inventario.')).toBeInTheDocument();
  });

  it('muestra el mensaje de carga mientras el inventario se carga', () => {
    useInventory.mockReturnValue({
      inventory: [],
      loading: true,
      error: null,
      addNewProduct: vi.fn(),
      updateProductStock: vi.fn(),
    });

    render(<InventoryPage />);

    expect(screen.getByText('Cargando inventario...')).toBeInTheDocument();
  });

  it('muestra el mensaje de error cuando hay un problema con el inventario', () => {
    useInventory.mockReturnValue({
      inventory: [],
      loading: false,
      error: new Error('No disponible'),
      addNewProduct: vi.fn(),
      updateProductStock: vi.fn(),
    });

    render(<InventoryPage />);

    expect(screen.getByText('Error: No disponible')).toBeInTheDocument();
  });

  it('llama a addNewProduct cuando se envía el formulario de nuevo producto', async () => {
    const addNewProduct = vi.fn().mockResolvedValue({ success: true });

    useInventory.mockReturnValue({
      inventory: [],
      loading: false,
      error: null,
      addNewProduct,
      updateProductStock: vi.fn(),
    });

    render(<InventoryPage />);

    fireEvent.click(screen.getByRole('button', { name: /nuevo producto/i }));

    const textboxes = screen.getAllByRole('textbox');
    fireEvent.change(textboxes[0], { target: { value: 'P1' } });
    fireEvent.change(textboxes[1], { target: { value: 'A1' } });
    fireEvent.change(screen.getByRole('spinbutton'), { target: { value: '5' } });

    fireEvent.click(screen.getByRole('button', { name: /guardar producto/i }));

    await waitFor(() => expect(addNewProduct).toHaveBeenCalledWith({ productoCodigo: 'P1', almacenCodigo: 'A1', stock: 5 }));
  });

  it('llama a updateProductStock cuando se envía el formulario de actualización', async () => {
    const updateProductStock = vi.fn().mockResolvedValue({ success: true });

    useInventory.mockReturnValue({
      inventory: [
        { id: 1, productoCodigo: 'PROD1', almacenCodigo: 'ALM1', stock: 12 },
      ],
      loading: false,
      error: null,
      addNewProduct: vi.fn(),
      updateProductStock,
    });

    render(<InventoryPage />);

    const row = screen.getByText('PROD1').closest('tr');
    const editButton = within(row).getByRole('button');
    fireEvent.click(editButton);

    fireEvent.change(screen.getByRole('spinbutton'), { target: { value: '20' } });
    fireEvent.click(screen.getByRole('button', { name: /actualizar stock/i }));

    await waitFor(() => expect(updateProductStock).toHaveBeenCalledWith({ productoCodigo: 'PROD1', almacenCodigo: 'ALM1', stock: 20 }));
  });

  it('muestra los productos en la tabla cuando existe inventario', () => {
    useInventory.mockReturnValue({
      inventory: [
        { id: 1, productoCodigo: 'PROD1', almacenCodigo: 'ALM1', stock: 12 },
      ],
      loading: false,
      error: null,
      addNewProduct: vi.fn(),
      updateProductStock: vi.fn(),
    });

    render(<InventoryPage />);

    expect(screen.getByText('PROD1')).toBeInTheDocument();
    expect(screen.getByText('ALM1')).toBeInTheDocument();
    expect(screen.getByText('12')).toBeInTheDocument();
  });
});
