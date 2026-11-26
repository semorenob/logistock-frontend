import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { Navbar } from './Navbar';
import { AuthProvider } from '../context/AuthContext';
import { CarritoProvider } from '../context/CarritoContext';

const renderizar = () =>
  render(
    <MemoryRouter>
      <AuthProvider>
        <CarritoProvider>
          <Navbar />
        </CarritoProvider>
      </AuthProvider>
    </MemoryRouter>
  );

describe('Navbar', () => {
  beforeEach(() => localStorage.clear());
  afterEach(() => localStorage.clear());

  it('sin sesion muestra login y registro, y oculta el acceso al panel', () => {
    renderizar();

    expect(screen.getByRole('link', { name: 'Iniciar sesión' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Crear cuenta' })).toBeInTheDocument();
    expect(screen.queryByRole('link', { name: /Panel admin/ })).not.toBeInTheDocument();
  });

  it('un cliente con sesion no ve el acceso al panel', () => {
    localStorage.setItem(
      'logistock_usuario',
      JSON.stringify({ email: 'ana@ejemplo.cl', nombre: 'Ana Cliente', rol: 'CLIENTE' })
    );
    localStorage.setItem('logistock_token', 'token-falso');

    renderizar();

    expect(screen.getByTestId('usuario-navbar').textContent).toContain('Ana Cliente');
    expect(screen.getByRole('button', { name: 'Cerrar sesión' })).toBeInTheDocument();
    expect(screen.queryByRole('link', { name: /Panel admin/ })).not.toBeInTheDocument();
  });

  it('un administrador con sesion ve el acceso al panel', () => {
    localStorage.setItem(
      'logistock_usuario',
      JSON.stringify({ email: 'admin@logistock.cl', nombre: 'Administrador', rol: 'ADMIN' })
    );
    localStorage.setItem('logistock_token', 'token-falso');

    renderizar();

    expect(screen.getByRole('link', { name: /Panel admin/ })).toBeInTheDocument();
    expect(screen.getByTestId('usuario-navbar').textContent).toContain('ADMIN');
  });
});
