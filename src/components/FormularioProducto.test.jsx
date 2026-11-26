import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { FormularioProducto } from './FormularioProducto';

const productoExistente = {
  id: 3,
  nombre: 'Zapatillas Nike Air',
  descripcion: 'Talla 42',
  precio: 65000,
  stock: 12,
  categoria: 'Calzado',
  imagenUrl: '',
};

const respuestaProducto = { ...productoExistente };

beforeEach(() => {
  vi.stubGlobal(
    'fetch',
    vi.fn(async () => ({
      ok: true,
      status: 200,
      json: async () => respuestaProducto,
    }))
  );
});

afterEach(() => {
  vi.unstubAllGlobals();
});

describe('FormularioProducto', () => {
  it('crea un producto y avisa al guardarlo', async () => {
    const onGuardado = vi.fn();
    render(<FormularioProducto onCerrar={() => {}} onGuardado={onGuardado} />);

    expect(screen.getByText('Nuevo producto')).toBeInTheDocument();

    fireEvent.change(screen.getByLabelText('Nombre*'), {
      target: { value: 'Teclado Mecánico RGB' },
    });
    fireEvent.change(screen.getByLabelText('Precio (CLP)*'), { target: { value: '35000' } });
    fireEvent.change(screen.getByLabelText('Stock*'), { target: { value: '25' } });
    fireEvent.click(screen.getByRole('button', { name: 'Crear producto' }));

    await waitFor(() => expect(onGuardado).toHaveBeenCalledTimes(1));
    expect(onGuardado).toHaveBeenCalledWith(respuestaProducto, false);

    const [url, opciones] = fetch.mock.calls[0];
    expect(url).toContain('/api/productos');
    expect(opciones.method).toBe('POST');
    expect(JSON.parse(opciones.body).nombre).toBe('Teclado Mecánico RGB');
  });

  it('edita un producto existente usando put', async () => {
    const onGuardado = vi.fn();
    render(
      <FormularioProducto
        productoInicial={productoExistente}
        categorias={['Calzado']}
        onCerrar={() => {}}
        onGuardado={onGuardado}
      />
    );

    expect(screen.getByText('Editar producto')).toBeInTheDocument();

    fireEvent.change(screen.getByLabelText('Precio (CLP)*'), { target: { value: '59990' } });
    fireEvent.click(screen.getByRole('button', { name: 'Guardar cambios' }));

    await waitFor(() => expect(onGuardado).toHaveBeenCalledTimes(1));
    const [url, opciones] = fetch.mock.calls[0];
    expect(url).toContain('/api/productos/3');
    expect(opciones.method).toBe('PUT');
  });

  it('muestra el error cuando la api falla', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn(async () => ({
        ok: false,
        status: 403,
        json: async () => ({ error: 'Forbidden' }),
      }))
    );

    render(<FormularioProducto onCerrar={() => {}} onGuardado={() => {}} />);
    fireEvent.change(screen.getByLabelText('Nombre*'), { target: { value: 'X' } });
    fireEvent.change(screen.getByLabelText('Precio (CLP)*'), { target: { value: '1' } });
    fireEvent.change(screen.getByLabelText('Stock*'), { target: { value: '1' } });
    fireEvent.click(screen.getByRole('button', { name: 'Crear producto' }));

    await waitFor(() => expect(screen.getByRole('alert')).toBeInTheDocument());
  });
});
