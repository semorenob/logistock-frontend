import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { act, render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { AuthProvider, useAuth } from './AuthContext';

let captor;

const SondaLogin = () => {
  const { login, usuario, autenticado, esAdmin } = useAuth();
  return (
    <div>
      <span data-testid="estado">{`${autenticado}-${esAdmin}`}</span>
      <span data-testid="usuario">{usuario?.nombre ?? 'nadie'}</span>
      <button type="button" onClick={() => login('admin@logistock.cl', 'secreto123')}>
        entrar
      </button>
    </div>
  );
};

describe('AuthContext', () => {
  beforeEach(() => {
    localStorage.clear();
    captor = {};
    vi.stubGlobal(
      'fetch',
      vi.fn(async (url, init = {}) => {
        captor.url = url;
        captor.body = JSON.parse(init.body ?? '{}');
        return {
          ok: true,
          status: 200,
          json: async () => ({
            token: 'jwt-de-prueba',
            email: 'admin@logistock.cl',
            nombre: 'Administrador LogiStock',
            rol: 'ADMIN',
          }),
        };
      })
    );
  });

  afterEach(() => {
    vi.unstubAllGlobals();
    localStorage.clear();
  });

  it('guarda el token y el usuario tras el login', async () => {
    render(
      <MemoryRouter>
        <AuthProvider>
          <SondaLogin />
        </AuthProvider>
      </MemoryRouter>
    );

    expect(screen.getByTestId('estado').textContent).toBe('false-false');

    await act(async () => {
      screen.getByRole('button', { name: 'entrar' }).click();
    });

    await waitFor(() => {
      expect(screen.getByTestId('estado').textContent).toBe('true-true');
    });
    expect(screen.getByTestId('usuario').textContent).toBe('Administrador LogiStock');
    expect(captor.url).toContain('/auth/login');
    expect(captor.body).toEqual({ email: 'admin@logistock.cl', password: 'secreto123' });
    expect(localStorage.getItem('logistock_token')).toBe('jwt-de-prueba');
  });

  it('restaura la sesión desde localStorage', () => {
    localStorage.setItem(
      'logistock_usuario',
      JSON.stringify({ email: 'ana@ejemplo.cl', nombre: 'Ana', rol: 'CLIENTE' })
    );

    render(
      <MemoryRouter>
        <AuthProvider>
          <SondaLogin />
        </AuthProvider>
      </MemoryRouter>
    );

    expect(screen.getByTestId('estado').textContent).toBe('true-false');
    expect(screen.getByTestId('usuario').textContent).toBe('Ana');
  });
});
