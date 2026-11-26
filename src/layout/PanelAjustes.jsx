import React, { useState } from 'react';
import { useAjustes } from '../context/AjustesContext';

// interruptor reutilizable para las opciones si/no del panel
const Interruptor = ({ etiqueta, activo, onChange }) => (
  <button
    type="button"
    role="switch"
    aria-checked={activo}
    onClick={() => onChange(!activo)}
    className="flex w-full items-center justify-between gap-3 rounded-lg px-2 py-2 text-sm text-gray-700 hover:bg-gray-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 dark:text-gray-200 dark:hover:bg-gray-700/60"
  >
    <span>{etiqueta}</span>
    <span
      className={`relative inline-block h-5 w-9 shrink-0 rounded-full transition-colors ${
        activo ? 'bg-blue-600' : 'bg-gray-300 dark:bg-gray-600'
      }`}
    >
      <span
        className={`absolute top-0.5 left-0.5 h-4 w-4 rounded-full bg-white shadow transition-transform ${
          activo ? 'translate-x-4' : ''
        }`}
      />
    </span>
  </button>
);

const TAMANOS = [
  { valor: 'chico', etiqueta: 'A' },
  { valor: 'normal', etiqueta: 'A' },
  { valor: 'grande', etiqueta: 'A' },
];

export const PanelAjustes = () => {
  const [abierto, setAbierto] = useState(false);
  const { modoOscuro, tamanoLetra, notificaciones, cambiarAjuste } = useAjustes();

  return (
    <div className="no-print fixed bottom-4 left-4" style={{ zIndex: 1060 }}>
      {abierto && (
        <div
          className="mb-2 w-72 rounded-xl bg-white p-3 shadow-xl ring-1 ring-black/5 dark:bg-gray-800 dark:ring-white/10"
          role="dialog"
          aria-label="Ajustes de la aplicación"
        >
          <div className="mb-2 flex items-center justify-between px-2">
            <h6 className="text-sm font-bold text-gray-900 dark:text-white">Ajustes</h6>
            <button
              type="button"
              aria-label="Cerrar ajustes"
              className="rounded-md p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-600 dark:hover:bg-gray-700 dark:hover:text-gray-200"
              onClick={() => setAbierto(false)}
            >
              <svg className="h-4 w-4" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M5 5l10 10M15 5L5 15" strokeLinecap="round" />
              </svg>
            </button>
          </div>

          <Interruptor
            etiqueta="Modo oscuro"
            activo={modoOscuro}
            onChange={(valor) => cambiarAjuste({ modoOscuro: valor })}
          />
          <Interruptor
            etiqueta="Notificaciones"
            activo={notificaciones}
            onChange={(valor) => cambiarAjuste({ notificaciones: valor })}
          />

          <div className="mt-1 rounded-lg px-2 py-2">
            <p className="mb-2 text-sm text-gray-700 dark:text-gray-200">Tamaño de letra</p>
            <div className="flex gap-2" role="group" aria-label="Tamaño de letra">
              {TAMANOS.map((tam, i) => (
                <button
                  key={tam.valor}
                  type="button"
                  aria-pressed={tamanoLetra === tam.valor}
                  onClick={() => cambiarAjuste({ tamanoLetra: tam.valor })}
                  className={`flex h-9 flex-1 items-center justify-center rounded-lg border font-semibold transition-colors ${
                    tamanoLetra === tam.valor
                      ? 'border-blue-600 bg-blue-600 text-white'
                      : 'border-gray-300 text-gray-600 hover:bg-gray-100 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700/60'
                  }`}
                >
                  <span className={i === 0 ? 'text-xs' : i === 1 ? 'text-sm' : 'text-base'}>
                    {tam.etiqueta}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      <button
        type="button"
        aria-label="Abrir ajustes"
        aria-expanded={abierto}
        onClick={() => setAbierto((prev) => !prev)}
        className="flex h-11 w-11 items-center justify-center rounded-full bg-gray-900 text-white shadow-lg transition-transform hover:scale-105 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 dark:bg-gray-700"
      >
        {abierto ? (
          <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M6 6l12 12M18 6L6 18" strokeLinecap="round" />
          </svg>
        ) : (
          <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="3" />
            <path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 11-2.83 2.83l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 11-4 0v-.09a1.65 1.65 0 00-1-1.51 1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 11-2.83-2.83l.06-.06a1.65 1.65 0 00.33-1.82 1.65 1.65 0 00-1.51-1H3a2 2 0 110-4h.09a1.65 1.65 0 001.51-1 1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 112.83-2.83l.06.06a1.65 1.65 0 001.82.33h0a1.65 1.65 0 001-1.51V3a2 2 0 114 0v.09a1.65 1.65 0 001 1.51h0a1.65 1.65 0 001.82-.33l.06-.06a2 2 0 112.83 2.83l-.06.06a1.65 1.65 0 00-.33 1.82v0a1.65 1.65 0 001.51 1H21a2 2 0 110 4h-.09a1.65 1.65 0 00-1.51 1z" />
          </svg>
        )}
      </button>
    </div>
  );
};
