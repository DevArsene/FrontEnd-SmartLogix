import '@testing-library/jest-dom';
import { render, screen, fireEvent } from '@testing-library/react';
import { vi } from 'vitest';
import Modal from '../../src/components/Modal.jsx';

describe('Modal', () => {
  it('no renderiza nada cuando isOpen es false', () => {
    const { container } = render(<Modal isOpen={false} title="Prueba" onClose={() => {}}>Contenido</Modal>);
    expect(container).toBeEmptyDOMElement();
  });

  it('muestra el modal cuando isOpen es true y llama a onClose', () => {
    const onClose = vi.fn();

    render(
      <Modal isOpen title="Prueba" onClose={onClose}>
        Contenido
      </Modal>
    );

    expect(screen.getByText('Prueba')).toBeInTheDocument();
    expect(screen.getByText('Contenido')).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: '×' }));
    expect(onClose).toHaveBeenCalledTimes(1);
  });
});
