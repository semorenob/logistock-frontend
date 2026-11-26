import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { Registro } from './Registro';
import { AuthProvider } from '../context/AuthContext';

const renderizar = () =>
  render(
    <MemoryRouter initialEntries={['/registro']}>
      <AuthProvider>
        <Registro />
      </AuthProvider>
    </MemoryRouter>
  );

const completarFormulario = () => {
  fireEvent.change(screen.getByLabelText('Nombre completo'), {
    target: { value: 'Ana Pérez' },
  });
  fireEvent.change(screen.getByLabelText('Correo electrónico'), {
    target: { value: 'ana@ejemplo.cl' },
  });
  fireEvent.change(screen.getByLabelText('Contraseña'), {
    target: { value: 'secreto123' },
  });
};

describe('Registro', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.stubGlobal(
      'fetch',
      vi.fn(async () => ({
        ok: true,
        status: 200,
        json: async () => ({
          token: 'jwt-de-prueba',
          email: 'ana@ejemplo.cl',
          nombre: 'Ana Pérez',
          rol: 'CLIENTE',
        }),
      }))
    );
  });

  afterEach(() => {
    vi.unstubAllGlobals();
    localStorage.clear();
  });

  it('no ofrece elegir el rol: no existe el selector', () => {
    renderizar();

    expect(screen.queryByLabelText('Rol')).not.toBeInTheDocument();
    expect(screen.queryByRole('combobox')).not.toBeInTheDocument();
  });

  it('registra siempre como cliente, aunque nadie elija el rol', async () => {
    renderizar();
    completarFormulario();
    fireEvent.click(screen.getByRole('button', { name: 'Crear cuenta' }));

    await waitFor(() => {
      expect(fetch).toHaveBeenCalled();
    });

    const cuerpo = JSON.parse(fetch.mock.calls[0][1].body);
    expect(cuerpo.rol).toBe('CLIENTE');
    expect(localStorage.getItem('logistock_token')).toBe('jwt-de-prueba');
    expect(localStorage.getItem('logistock_usuario')).toContain('CLIENTE');
  });

  it('muestra el error cuando el registro falla', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn(async () => ({
        ok: false,
        status: 409,
        json: async () => ({}),
      }))
    );

    renderizar();
    completarFormulario();
    fireEvent.click(screen.getByRole('button', { name: 'Crear cuenta' }));

    await waitFor(() => {
      expect(screen.getByTestId('error-registro')).toBeInTheDocument();
    });
    expect(localStorage.getItem('logistock_token')).toBeNull();
  });

  it('no envia el formulario con campos vacios', () => {
    renderizar();
    fireEvent.click(screen.getByRole('button', { name: 'Crear cuenta' }));

    expect(fetch).not.toHaveBeenCalled();
  });
});
