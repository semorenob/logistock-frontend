import React from 'react';
import { Link } from 'react-router-dom';
import { boton } from '../utils/estilos';

export const NoEncontrado = () => (
  <div className="mx-auto my-10 max-w-2xl px-4">
    <div className="rounded-2xl bg-white p-10 text-center shadow-sm ring-1 ring-black/5 dark:bg-gray-800 dark:ring-white/10">
      <h1 className="mb-2 text-6xl font-bold text-gray-900 dark:text-white">404</h1>
      <h3 className="mb-3 text-xl font-semibold text-gray-800 dark:text-gray-200">
        Página no encontrada
      </h3>
      <p className="mb-6 text-sm text-gray-500 dark:text-gray-400">
        La página que buscas no existe o fue movida a otra dirección.
      </p>
      <div className="flex flex-col justify-center gap-2 sm:flex-row">
        <Link to="/" className={boton('primario')}>
          Volver al Inicio
        </Link>
        <Link to="/categorias" className={boton('bordeOscuro')}>
          Ir a Categorías
        </Link>
      </div>
    </div>
  </div>
);
