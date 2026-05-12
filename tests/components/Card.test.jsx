import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import Card from '../../src/components/Card.jsx';

describe('Card', () => {
  it('renderiza el título, el contenido y las acciones', () => {
    render(
      <Card title="Tarjeta de prueba" actions={<button>Acción</button>}>
        Contenido de tarjeta
      </Card>
    );

    expect(screen.getByText('Tarjeta de prueba')).toBeInTheDocument();
    expect(screen.getByText('Contenido de tarjeta')).toBeInTheDocument();
    expect(screen.getByText('Acción')).toBeInTheDocument();
  });
});
