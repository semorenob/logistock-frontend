import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { act, fireEvent, render, screen } from '@testing-library/react';
import { AjustesProvider, useAjustes } from './AjustesContext';

const Sonda = () => {
  const { modoOscuro, tamanoLetra, notificaciones, cambiarAjuste } = useAjustes();
  return (
    <div>
      <span data-testid="modo">{String(modoOscuro)}</span>
      <span data-testid="tamano">{tamanoLetra}</span>
      <span data-testid="notificaciones">{String(notificaciones)}</span>
      <button type="button" onClick={() => cambiarAjuste({ modoOscuro: true })}>
        oscuro
      </button>
      <button type="button" onClick={() => cambiarAjuste({ tamanoLetra: 'grande' })}>
        grande
      </button>
    </div>
  );
};

describe('AjustesContext', () => {
  beforeEach(() => {
    localStorage.clear();
    document.documentElement.className = '';
    document.documentElement.style.fontSize = '';
  });

  afterEach(() => {
    localStorage.clear();
    document.documentElement.classList.remove('dark');
    document.documentElement.style.fontSize = '';
  });

  it('parte con los valores por defecto', () => {
    render(
      <AjustesProvider>
        <Sonda />
      </AjustesProvider>
    );

    expect(screen.getByTestId('modo').textContent).toBe('false');
    expect(screen.getByTestId('tamano').textContent).toBe('normal');
    expect(screen.getByTestId('notificaciones').textContent).toBe('true');
  });

  it('aplica el modo oscuro sobre el html y lo guarda en localStorage', async () => {
    render(
      <AjustesProvider>
        <Sonda />
      </AjustesProvider>
    );

    await act(async () => {
      screen.getByRole('button', { name: 'oscuro' }).click();
    });

    expect(document.documentElement.classList.contains('dark')).toBe(true);
    expect(JSON.parse(localStorage.getItem('logistock_ajustes')).modoOscuro).toBe(true);
  });

  it('cambia el tamaño de letra del documento', async () => {
    render(
      <AjustesProvider>
        <Sonda />
      </AjustesProvider>
    );

    await act(async () => {
      screen.getByRole('button', { name: 'grande' }).click();
    });

    expect(document.documentElement.style.fontSize).toBe('18px');
    expect(screen.getByTestId('tamano').textContent).toBe('grande');
  });

  it('recupera los ajustes guardados', () => {
    localStorage.setItem(
      'logistock_ajustes',
      JSON.stringify({ modoOscuro: true, tamanoLetra: 'chico', notificaciones: false })
    );

    render(
      <AjustesProvider>
        <Sonda />
      </AjustesProvider>
    );

    expect(screen.getByTestId('modo').textContent).toBe('true');
    expect(screen.getByTestId('tamano').textContent).toBe('chico');
    expect(screen.getByTestId('notificaciones').textContent).toBe('false');
  });
});

describe('PanelAjustes', () => {
  it('se abre con el boton y permite activar el modo oscuro', async () => {
    const { PanelAjustes } = await import('../layout/PanelAjustes');
    localStorage.clear();

    render(
      <AjustesProvider>
        <PanelAjustes />
      </AjustesProvider>
    );

    expect(screen.queryByText('Modo oscuro')).not.toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: 'Abrir ajustes' }));
    expect(screen.getByText('Modo oscuro')).toBeInTheDocument();
    expect(screen.getByText('Notificaciones')).toBeInTheDocument();
    expect(screen.getByText('Tamaño de letra')).toBeInTheDocument();

    fireEvent.click(screen.getByRole('switch', { name: 'Modo oscuro' }));
    expect(document.documentElement.classList.contains('dark')).toBe(true);
  });
});
