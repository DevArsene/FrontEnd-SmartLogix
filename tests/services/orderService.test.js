import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

vi.stubEnv('VITE_API_BASE_URL', 'http://localhost:8082/api/inventory');
vi.stubEnv('VITE_ORDERS_API_URL', 'http://localhost:8083');

const { createOrderViaBff, getAllOrders } = await import('../../src/services/orderService.js');

describe('orderService', () => {
  beforeEach(() => {
    global.fetch = vi.fn();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('crea una orden a través del BFF', async () => {
    global.fetch.mockResolvedValue({ ok: true, json: async () => ({ success: true }) });
    const result = await createOrderViaBff('VENTA', 'P1', 3);

    expect(result).toEqual({ success: true });
    expect(global.fetch).toHaveBeenCalledWith(
      'http://localhost:8082/api/inventory/bff/checkout?tipo=VENTA&codigoProducto=P1&cantidad=3',
      { method: 'POST' }
    );
  });

  it('lanza un error si la creación de pedido falla', async () => {
    global.fetch.mockResolvedValue({ ok: false });
    await expect(createOrderViaBff('VENTA', 'P1', 3)).rejects.toThrow('Error en BFF');
  });

  it('obtiene todos los pedidos', async () => {
    global.fetch.mockResolvedValue({ ok: true, json: async () => [{ id: 1 }] });
    const result = await getAllOrders();

    expect(result).toEqual([{ id: 1 }]);
    expect(global.fetch).toHaveBeenCalledWith('http://localhost:8083/all');
  });

  it('lanza un error si getAllOrders falla', async () => {
    global.fetch.mockResolvedValue({ ok: false });
    await expect(getAllOrders()).rejects.toThrow('Error al obtener pedidos');
  });
});
