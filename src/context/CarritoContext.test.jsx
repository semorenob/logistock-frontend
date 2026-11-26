import { afterEach, describe, expect, it, vi } from 'vitest';
import { act, render, screen } from '@testing-library/react';
import { CarritoProvider, useCarrito } from './CarritoContext';

const Sonda = () => {
  const { carrito, agregarAlCarrito, totalCarrito, cantidadItems, eliminarDelCarrito } =
    useCarrito();
  return (
    <div>
      <ul>
        {carrito.map((item) => (
          <li key={item.id} data-testid={`item-${item.id}`}>
            {item.nombre} x{item.cantidad} = {item.precio * item.cantidad}
          </li>
        ))}
      </ul>
      <span data-testid="total">{totalCarrito}</span>
      <span data-testid="cantidad">{cantidadItems}</span>
      <button type="button" onClick={() => agregarAlCarrito({ id: 1, nombre: 'Arroz', precio: 1990, stock: 10 })}>
        agregar
      </button>
      <button type="button" onClick={() => eliminarDelCarrito(1)}>quitar</button>
    </div>
  );
};

describe('CarritoContext', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('agrega productos, acumula cantidades y calcula el total', async () => {
    render(
      <CarritoProvider>
        <Sonda />
      </CarritoProvider>
    );

    await act(async () => {
      screen.getByRole('button', { name: 'agregar' }).click();
    });
    await act(async () => {
      screen.getByRole('button', { name: 'agregar' }).click();
    });

    expect(screen.getByTestId('item-1').textContent).toBe('Arroz x2 = 3980');
    expect(screen.getByTestId('total').textContent).toBe('3980');
    expect(screen.getByTestId('cantidad').textContent).toBe('2');

    await act(async () => {
      screen.getByRole('button', { name: 'quitar' }).click();
    });
    expect(screen.queryByTestId('item-1')).not.toBeInTheDocument();
    expect(screen.getByTestId('total').textContent).toBe('0');
  });

  it('no agrega productos sin stock (regla del backend)', async () => {
    const { rerender } = render(
      <CarritoProvider>
        <Sonda />
      </CarritoProvider>
    );

    const SondaSinStock = () => {
      const { agregarAlCarrito, carrito } = useCarrito();
      return (
        <div>
          <span data-testid="items">{carrito.length}</span>
          <button
            type="button"
            onClick={() => agregarAlCarrito({ id: 9, nombre: 'X', precio: 100, stock: 0 })}
          >
            agregar
          </button>
        </div>
      );
    };

    rerender(
      <CarritoProvider>
        <SondaSinStock />
      </CarritoProvider>
    );

    await act(async () => {
      screen.getByRole('button', { name: 'agregar' }).click();
    });
    expect(screen.getByTestId('items').textContent).toBe('0');
  });
});
