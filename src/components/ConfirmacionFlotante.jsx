import React from 'react';
import { botonPequeno } from '../utils/estilos';

export const ConfirmacionFlotante = ({
  mensaje,
  titulo = 'Confirmar acción',
  textoConfirmar = 'Confirmar',
  textoCancelar = 'Cancelar',
  onConfirmar,
  onCancelar,
}) => {
  if (!mensaje) return null;

  return (
    <div
      className="no-print fixed inset-x-4 bottom-4 flex justify-end sm:inset-x-auto sm:right-4 sm:bottom-4"
      style={{ zIndex: 1080 }}
    >
      <div
        className="w-full max-w-sm rounded-xl border-0 border-l-4 border-red-500 bg-white p-3 shadow-xl ring-1 ring-black/5 dark:bg-gray-800 dark:ring-white/10"
        role="dialog"
        aria-labelledby="confirmacion-flotante-titulo"
      >
        <div className="mb-2 flex items-start gap-2 text-left">
          <span className="text-lg leading-none">🗑️</span>
          <h6
            id="confirmacion-flotante-titulo"
            className="mb-0 flex-1 text-sm font-bold text-gray-900 dark:text-white"
          >
            {titulo}
          </h6>
          <button
            type="button"
            className="rounded-md p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-600 dark:hover:bg-gray-700 dark:hover:text-gray-200"
            aria-label="Cerrar confirmación"
            onClick={onCancelar}
          >
            <svg className="h-4 w-4" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M5 5l10 10M15 5L5 15" strokeLinecap="round" />
            </svg>
          </button>
        </div>
        <p className="mb-3 text-left text-sm text-gray-600 dark:text-gray-300">{mensaje}</p>
        <div className="flex justify-end gap-2">
          <button type="button" className={botonPequeno('secundario')} onClick={onCancelar}>
            {textoCancelar}
          </button>
          <button type="button" className={botonPequeno('peligro')} onClick={onConfirmar}>
            {textoConfirmar}
          </button>
        </div>
      </div>
    </div>
  );
};
