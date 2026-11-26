import { describe, expect, it, vi } from 'vitest';
import { fireEvent, render, screen } from '@testing-library/react';
import { ConfirmacionFlotante } from './ConfirmacionFlotante';

describe('ConfirmacionFlotante', () => {
  it('no renderiza nada si no hay mensaje', () => {
    const { container } = render(
      <ConfirmacionFlotante mensaje={null} onConfirmar={() => {}} onCancelar={() => {}} />
    );
    expect(container.firstChild).toBeNull();
  });

  it('llama a onConfirmar al confirmar y a onCancelar al cancelar', () => {
    const onConfirmar = vi.fn();
    const onCancelar = vi.fn();
    render(
      <ConfirmacionFlotante
        mensaje="¿Deseas eliminar «Notebook HP 15»?"
        titulo="Eliminar producto"
        onConfirmar={onConfirmar}
        onCancelar={onCancelar}
      />
    );

    fireEvent.click(screen.getByRole('button', { name: 'Confirmar' }));
    expect(onConfirmar).toHaveBeenCalledTimes(1);

    fireEvent.click(screen.getByRole('button', { name: 'Cancelar' }));
    expect(onCancelar).toHaveBeenCalledTimes(1);
  });
});
