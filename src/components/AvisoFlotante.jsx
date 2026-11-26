import React, { useEffect } from 'react';
import { useAjustes } from '../context/AjustesContext';

const ESTILOS = {
  success: { borde: 'border-emerald-500', icono: '✅' },
  warning: { borde: 'border-amber-400', icono: '⚠️' },
  danger: { borde: 'border-red-500', icono: '❌' },
  info: { borde: 'border-sky-500', icono: 'ℹ️' },
};

export const AvisoFlotante = ({ mensaje, titulo, tipo = 'success', onClose, duracion = 4000 }) => {
  const { notificaciones } = useAjustes();

  useEffect(() => {
    if (!mensaje || !notificaciones) return undefined;

    const id = setTimeout(() => {
      if (onClose) onClose();
    }, duracion);

    return () => clearTimeout(id);
  }, [mensaje, tipo, titulo, duracion, onClose, notificaciones]);

  if (!mensaje || !notificaciones) return null;

  const estilo = ESTILOS[tipo] || ESTILOS.success;

  return (
    <div
      className="no-print fixed inset-x-4 bottom-4 flex justify-end sm:inset-x-auto sm:right-4 sm:bottom-4"
      style={{ zIndex: 1080 }}
      role="status"
      aria-live="polite"
    >
      <div
        className={`w-full max-w-sm rounded-xl border-0 border-l-4 bg-white p-3 shadow-xl ring-1 ring-black/5 dark:bg-gray-800 dark:ring-white/10 ${estilo.borde}`}
      >
        <div className="flex items-start gap-3 text-left">
          <span className="text-xl leading-none">{estilo.icono}</span>
          <div className="min-w-0 flex-1">
            {titulo && (
              <h6 className="mb-1 text-sm font-bold text-gray-900 dark:text-white">{titulo}</h6>
            )}
            <p className="mb-0 text-sm text-gray-600 dark:text-gray-300">{mensaje}</p>
          </div>
          <button
            type="button"
            className="rounded-md p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-600 dark:hover:bg-gray-700 dark:hover:text-gray-200"
            aria-label="Cerrar aviso"
            onClick={onClose}
          >
            <svg className="h-4 w-4" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M5 5l10 10M15 5L5 15" strokeLinecap="round" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};
