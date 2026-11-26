import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { NoEncontrado } from './NoEncontrado';

describe('NoEncontrado', () => {
  it('muestra 404 y enlaces de navegacion', () => {
    render(
      <MemoryRouter>
        <NoEncontrado />
      </MemoryRouter>
    );

    expect(screen.getByText('404')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Volver al Inicio' })).toHaveAttribute('href', '/');
    expect(screen.getByRole('link', { name: 'Ir a Categorías' })).toHaveAttribute(
      'href',
      '/categorias'
    );
  });
});
