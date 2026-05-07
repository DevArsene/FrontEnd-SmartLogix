import { useInventory } from './hooks/useInventory';

function App() {
  const { inventory, loading, error } = useInventory();

  if (loading) return <p>Cargando inventario...</p>;
  if (error) return <p>Error: {error.message}</p>;

  return (
    <div>
      <h1>Inventario</h1>
      <table>
        <thead>
          <tr>
            <th>Código Producto</th>
            <th>Código Almacén</th>
            <th>Stock</th>
          </tr>
        </thead>
        <tbody>
          {inventory.map(item => (
            <tr key={item.id}>
              <td>{item.productoCodigo}</td>
              <td>{item.almacenCodigo}</td>
              <td>{item.stock}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default App;