import { afterEach, describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { AvisoFlotante } from './AvisoFlotante';
import { AjustesProvider } from '../context/AjustesContext';

const renderizar = (ui) => render(<AjustesProvider>{ui}</AjustesProvider>);

describe('AvisoFlotante', () => {
  afterEach(() => {
    localStorage.clear();
  });

  it('no renderiza nada si no hay mensaje', () => {
    const { container } = renderizar(<AvisoFlotante mensaje={null} onClose={() => {}} />);
    expect(container.firstChild).toBeNull();
  });

  it('muestra titulo y mensaje', () => {
    renderizar(
      <AvisoFlotante mensaje="Producto creado" titulo="Éxito" tipo="success" onClose={() => {}} />
    );
    expect(screen.getByText('Producto creado')).toBeInTheDocument();
    expect(screen.getByText('Éxito')).toBeInTheDocument();
  });

  it('no muestra el aviso cuando las notificaciones estan desactivadas', () => {
    localStorage.setItem(
      'logistock_ajustes',
      JSON.stringify({ modoOscuro: false, tamanoLetra: 'normal', notificaciones: false })
    );

    renderizar(<AvisoFlotante mensaje="Producto creado" titulo="Éxito" onClose={() => {}} />);
    expect(screen.queryByText('Producto creado')).not.toBeInTheDocument();
  });
});
