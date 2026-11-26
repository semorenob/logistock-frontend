import React from 'react';
import { clp, estaEnOferta, STOCK_CRITICO } from '../utils/formato';
import { botonPequeno } from '../utils/estilos';

export const ProductoCard = ({ producto, agregarAlCarrito }) => {
  if (!producto) return null;

  const stock = producto.stock ?? 0;
  const enOferta = estaEnOferta(producto);
  const sinStock = stock <= 0;

  return (
    <div className="flex h-full flex-col overflow-hidden rounded-xl bg-white shadow-sm ring-1 ring-black/5 transition-shadow hover:shadow-md dark:bg-gray-800 dark:ring-white/10">
      <div className="h-44 shrink-0 bg-gray-100 dark:bg-gray-700/50">
        {producto.imagenUrl ? (
          <img
            src={producto.imagenUrl}
            className="h-full w-full object-contain"
            alt={producto.nombre}
            loading="lazy"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-4xl text-gray-300 dark:text-gray-500">
            📦
          </div>
        )}
      </div>

      <div className="flex flex-1 flex-col p-4">
        <div className="mb-2 flex flex-wrap items-center gap-1.5">
          {producto.categoria && (
            <span className="rounded-full bg-gray-100 px-2 py-0.5 text-xs font-medium text-gray-600 dark:bg-gray-700 dark:text-gray-300">
              {producto.categoria}
            </span>
          )}
          {enOferta && (
            <span className="rounded-full bg-red-100 px-2 py-0.5 text-xs font-bold text-red-700 dark:bg-red-950 dark:text-red-300">
              🔥 Oferta
            </span>
          )}
        </div>

        <h5 className="mb-1 text-base font-bold leading-snug text-gray-900 dark:text-white">
          {producto.nombre}
        </h5>
        {producto.descripcion && (
          <p className="mb-2 line-clamp-2 text-xs text-gray-500 dark:text-gray-400">
            {producto.descripcion}
          </p>
        )}

        <p
          className={`mb-2 text-xs font-bold ${
            sinStock
              ? 'text-red-600 dark:text-red-400'
              : stock <= STOCK_CRITICO
                ? 'text-amber-500'
                : 'text-blue-600 dark:text-blue-400'
          }`}
        >
          {sinStock ? 'Sin stock' : `Stock: ${stock} uds.`}
        </p>

        <div className="mt-auto flex items-center justify-between border-t border-gray-100 pt-3 dark:border-gray-700">
          <span
            className={`text-base font-bold ${
              enOferta ? 'text-red-600 dark:text-red-400' : 'text-emerald-600 dark:text-emerald-400'
            }`}
            data-testid="precio-producto"
          >
            ${clp(producto.precio)}
          </span>
          <button
            type="button"
            className={botonPequeno('oscuro')}
            disabled={sinStock}
            onClick={() => agregarAlCarrito?.(producto)}
          >
            Añadir
          </button>
        </div>
      </div>
    </div>
  );
};
