import { describe, expect, it, vi } from 'vitest';
import { fireEvent, render, screen } from '@testing-library/react';
import { ProductoCard } from './ProductoCard';

const producto = {
  id: 1,
  nombre: 'Notebook HP 15',
  descripcion: 'OFERTA de temporada, 16GB RAM',
  precio: 450000,
  stock: 45,
  categoria: 'Electrónica',
  imagenUrl: 'https://example.com/notebook.jpg',
};

describe('ProductoCard', () => {
  it('muestra nombre, precio, stock y badge de oferta', () => {
    render(<ProductoCard producto={producto} agregarAlCarrito={() => {}} />);

    expect(screen.getByText('Notebook HP 15')).toBeInTheDocument();
    expect(screen.getByTestId('precio-producto').textContent).toContain('450.000');
    expect(screen.getByText(/Stock: 45 uds\./)).toBeInTheDocument();
    expect(screen.getByText('🔥 Oferta')).toBeInTheDocument();
  });

  it('llama a agregarAlCarrito al pulsar añadir', () => {
    const agregarAlCarrito = vi.fn();
    render(<ProductoCard producto={producto} agregarAlCarrito={agregarAlCarrito} />);

    fireEvent.click(screen.getByRole('button', { name: 'Añadir' }));
    expect(agregarAlCarrito).toHaveBeenCalledTimes(1);
    expect(agregarAlCarrito).toHaveBeenCalledWith(producto);
  });

  it('deshabilita el boton cuando no hay stock', () => {
    render(<ProductoCard producto={{ ...producto, stock: 0 }} agregarAlCarrito={() => {}} />);

    expect(screen.getByText('Sin stock')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Añadir' })).toBeDisabled();
  });
});
