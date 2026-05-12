import '@testing-library/jest-dom';
import { render, screen, fireEvent } from '@testing-library/react';
import { vi } from 'vitest';
import Button from '../../src/components/Button.jsx';

describe('Button', () => {
  it('renderiza el texto y aplica la clase correcta', () => {
    render(<Button variant="secondary">Guardar</Button>);

    const button = screen.getByRole('button', { name: /guardar/i });
    expect(button).toBeInTheDocument();
    expect(button).toHaveClass('btn btn-secondary');
  });

  it('llama al manejador onClick', () => {
    const handleClick = vi.fn();
    render(<Button onClick={handleClick}>Click</Button>);

    fireEvent.click(screen.getByText('Click'));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('desactiva el botón cuando disabled es true', () => {
    render(<Button disabled>Bloqueado</Button>);

    expect(screen.getByRole('button', { name: /bloqueado/i })).toBeDisabled();
  });
});
