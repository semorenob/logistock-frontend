import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { Login } from './Login';
import { AuthProvider } from '../context/AuthContext';

const renderizar = () =>
  render(
    <MemoryRouter initialEntries={['/login']}>
      <AuthProvider>
        <Login />
      </AuthProvider>
    </MemoryRouter>
  );

const completarFormulario = () => {
  fireEvent.change(screen.getByLabelText('Correo electrónico'), {
    target: { value: 'admin@logistock.cl' },
  });
  fireEvent.change(screen.getByLabelText('Contraseña'), {
    target: { value: 'secreto123' },
  });
};

describe('Login', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.stubGlobal(
      'fetch',
      vi.fn(async () => ({
        ok: true,
        status: 200,
        json: async () => ({
          token: 'jwt-de-prueba',
          email: 'admin@logistock.cl',
          nombre: 'Administrador LogiStock',
          rol: 'ADMIN',
        }),
      }))
    );
  });

  afterEach(() => {
    vi.unstubAllGlobals();
    localStorage.clear();
  });

  it('guarda la sesion cuando el login sale bien', async () => {
    renderizar();
    completarFormulario();
    fireEvent.click(screen.getByRole('button', { name: 'Ingresar' }));

    await waitFor(() => {
      expect(localStorage.getItem('logistock_token')).toBe('jwt-de-prueba');
    });
    expect(localStorage.getItem('logistock_usuario')).toContain('ADMIN');
  });

  it('muestra el error cuando el login falla', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn(async () => ({
        ok: false,
        status: 401,
        json: async () => ({}),
      }))
    );

    renderizar();
    completarFormulario();
    fireEvent.click(screen.getByRole('button', { name: 'Ingresar' }));

    await waitFor(() => {
      expect(screen.getByTestId('error-login')).toBeInTheDocument();
    });
    expect(screen.getByTestId('error-login').textContent).toContain('Credenciales inválidas');
    expect(localStorage.getItem('logistock_token')).toBeNull();
  });

  it('no envia el formulario con campos vacios', () => {
    renderizar();
    fireEvent.click(screen.getByRole('button', { name: 'Ingresar' }));

    expect(fetch).not.toHaveBeenCalled();
  });
});
