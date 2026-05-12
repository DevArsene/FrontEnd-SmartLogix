import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

vi.stubEnv('VITE_API_BASE_URL', 'http://localhost:8082/api/inventory');

const { getAllStock, getStock, addProduct, updateStock } = await import('../../src/services/inventoryService.js');

describe('inventoryService', () => {
  beforeEach(() => {
    global.fetch = vi.fn();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('obtiene todo el stock', async () => {
    global.fetch.mockResolvedValue({ ok: true, json: async () => [{ productoCodigo: 'P1' }] });
    const data = await getAllStock();

    expect(data).toEqual([{ productoCodigo: 'P1' }]);
    expect(global.fetch).toHaveBeenCalledWith('http://localhost:8082/api/inventory/all');
  });

  it('lanza un error si getAllStock devuelve un estado no ok', async () => {
    global.fetch.mockResolvedValue({ ok: false });
    await expect(getAllStock()).rejects.toThrow('Error al obtener inventario');
  });

  it('obtiene el stock por producto y almacén', async () => {
    global.fetch.mockResolvedValue({ ok: true, json: async () => ({ existe: true }) });
    const data = await getStock('P1', 'A1');

    expect(data).toEqual({ existe: true });
    expect(global.fetch).toHaveBeenCalledWith('http://localhost:8082/api/inventory/P1/A1');
  });

  it('lanza un error si getStock no encuentra el stock', async () => {
    global.fetch.mockResolvedValue({ ok: false });
    await expect(getStock('P1', 'A1')).rejects.toThrow('Stock no encontrado');
  });

  it('agrega un nuevo producto', async () => {
    const payload = { productoCodigo: 'P2' };
    global.fetch.mockResolvedValue({ ok: true, json: async () => payload });
    const data = await addProduct(payload);

    expect(data).toEqual(payload);
    expect(global.fetch).toHaveBeenCalledWith('http://localhost:8082/api/inventory/add', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
  });

  it('lanza un error si addProduct falla', async () => {
    global.fetch.mockResolvedValue({ ok: false });
    await expect(addProduct({ productoCodigo: 'P2' })).rejects.toThrow('Error al agregar producto');
  });

  it('actualiza el stock', async () => {
    const payload = { productoCodigo: 'P3' };
    global.fetch.mockResolvedValue({ ok: true, json: async () => payload });
    const data = await updateStock(payload);

    expect(data).toEqual(payload);
    expect(global.fetch).toHaveBeenCalledWith('http://localhost:8082/api/inventory/update', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
  });

  it('lanza un error si updateStock falla', async () => {
    global.fetch.mockResolvedValue({ ok: false });
    await expect(updateStock({ productoCodigo: 'P3' })).rejects.toThrow('Error al actualizar stock');
  });
});
