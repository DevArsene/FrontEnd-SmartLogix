import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { vi } from 'vitest';

vi.mock('../src/pages/InventoryPage.jsx', () => ({ default: () => <div>InventoryPageMock</div> }));
vi.mock('../src/pages/OrdersPage.jsx', () => ({ default: () => <div>OrdersPageMock</div> }));

import App from '../src/App.jsx';

describe('App', () => {
  it('renderiza la aplicación con la barra de navegación', () => {
    render(
      <MemoryRouter initialEntries={['/']}>
        <App />
      </MemoryRouter>
    );

    expect(screen.getByRole('navigation')).toBeInTheDocument();
    expect(screen.getByText('SmartLogix')).toBeInTheDocument();
    expect(screen.getByText('InventoryPageMock')).toBeInTheDocument();
  });

  it('navega a la página de pedidos', () => {
    render(
      <MemoryRouter initialEntries={['/orders']}>
        <App />
      </MemoryRouter>
    );

    expect(screen.getByText('OrdersPageMock')).toBeInTheDocument();
  });
});
