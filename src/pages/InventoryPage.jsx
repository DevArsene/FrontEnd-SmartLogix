import { useInventory } from '../hooks/useInventory';

export default function InventoryPage() {
  const { inventory, loading, error } = useInventory();

  if (loading) return <p>Cargando...</p>;
  if (error) return <p>Error: {error.message}</p>;

  return (
    <ul>
      {inventory.map(item => (
        <li key={item.id}>{item.name} — Stock: {item.quantity}</li>
      ))}
    </ul>
  );
}