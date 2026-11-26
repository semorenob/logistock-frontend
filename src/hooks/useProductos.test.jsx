import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { useProductos } from './useProductos';

const Sonda = () => {
  const { productos, cargando, error } = useProductos();
  if (cargando) return <p data-testid="cargando">cargando…</p>;
  if (error) return <p data-testid="error">{error}</p>;
  return (
    <ul>
      {productos.map((p) => (
        <li key={p.id}>{p.nombre}</li>
      ))}
    </ul>
  );
};

const renderHookUI = () =>
  render(
    <MemoryRouter>
      <Sonda />
    </MemoryRouter>
  );

describe('useProductos', () => {
  beforeEach(() => {
    vi.stubGlobal(
      'fetch',
      vi.fn(async () => ({
        ok: true,
        status: 200,
        json: async () => [
          { id: 1, nombre: 'Notebook HP 15', precio: 450000, stock: 45, categoria: 'Electrónica' },
          { id: 2, nombre: 'Arroz 1kg', precio: 2500, stock: 500, categoria: 'Alimentos' },
        ],
      }))
    );
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('carga la lista de productos desde GET /api/productos', async () => {
    renderHookUI();

    await waitFor(() => {
      expect(screen.getByText('Notebook HP 15')).toBeInTheDocument();
    });
    expect(screen.getByText('Arroz 1kg')).toBeInTheDocument();
    expect(fetch).toHaveBeenCalled();
  });

  it('muestra el error cuando la API falla', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn(async () => ({ ok: false, status: 500, json: async () => ({}) }))
    );

    renderHookUI();

    await waitFor(() => {
      expect(screen.getByTestId('error')).toBeInTheDocument();
    });
  });
});
