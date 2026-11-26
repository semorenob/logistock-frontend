import React from 'react';
import { useProductos } from '../hooks/useProductos';
import { useCarrito } from '../context/CarritoContext';
import { ProductoCard } from '../components/ProductoCard';
import { Cargando, ErrorCarga } from '../components/EstadoCarga';
import { estaEnOferta } from '../utils/formato';

export const Ofertas = () => {
  const { productos, cargando, error, recargar } = useProductos();
  const { agregarAlCarrito } = useCarrito();
  const ofertas = productos.filter(estaEnOferta);

  return (
    <div className="mx-auto my-6 max-w-6xl px-4">
      <h2 className="mb-2 text-center text-2xl font-bold text-red-600 dark:text-red-400">
        🔥 Productos en Oferta
      </h2>
      <p className="mb-6 text-center text-sm text-gray-500 dark:text-gray-400">
        Oportunidades de retail y tecnología con stock confirmado en bodega.
      </p>

      {cargando ? (
        <Cargando mensaje="Cargando ofertas desde el servidor…" />
      ) : error ? (
        <ErrorCarga mensaje={error} onReintentar={recargar} />
      ) : ofertas.length > 0 ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {ofertas.map((item) => (
            <ProductoCard key={item.id} producto={item} agregarAlCarrito={agregarAlCarrito} />
          ))}
        </div>
      ) : (
        <div className="py-12 text-center">
          <p className="text-base text-gray-500 dark:text-gray-400">
            No hay ofertas activas en este momento.
          </p>
        </div>
      )}
    </div>
  );
};
