import React from 'react';
import { boton } from '../utils/estilos';

export const Cargando = ({ mensaje = 'Cargando…' }) => (
  <div className="flex flex-col items-center justify-center gap-3 py-16 text-center">
    <div
      className="h-10 w-10 animate-spin rounded-full border-4 border-gray-200 border-t-blue-600 dark:border-gray-700"
      role="status"
      aria-label={mensaje}
    />
    <p className="text-sm text-gray-500 dark:text-gray-400">{mensaje}</p>
  </div>
);

export const ErrorCarga = ({ mensaje, onReintentar }) => (
  <div className="mx-auto max-w-lg rounded-xl border border-red-200 bg-red-50 p-6 text-center dark:border-red-900 dark:bg-red-950/50">
    <p className="mb-1 text-2xl">⚠️</p>
    <h3 className="mb-1 text-base font-bold text-red-700 dark:text-red-300">
      No se pudieron cargar los productos
    </h3>
    <p className="mb-4 text-sm text-red-600 dark:text-red-400">{mensaje}</p>
    {onReintentar && (
      <button type="button" className={boton('peligro')} onClick={onReintentar}>
        Reintentar
      </button>
    )}
  </div>
);
