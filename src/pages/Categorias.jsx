import React from 'react';
import { useSearchParams } from 'react-router-dom';
import { useProductos } from '../hooks/useProductos';
import { useCarrito } from '../context/CarritoContext';
import { ProductoCard } from '../components/ProductoCard';
import { Cargando, ErrorCarga } from '../components/EstadoCarga';
import { boton } from '../utils/estilos';

export const Categorias = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const { productos, cargando, error, recargar } = useProductos();
  const { agregarAlCarrito } = useCarrito();

  const categorias = ['Todas', ...new Set(productos.map((p) => p.categoria).filter(Boolean))];

  const categoriaParam = searchParams.get('cat');
  const categoriaSeleccionada = categorias.includes(categoriaParam) ? categoriaParam : 'Todas';

  const seleccionarCategoria = (cat) => {
    setSearchParams(cat === 'Todas' ? {} : { cat });
  };

  if (cargando) return <Cargando mensaje="Cargando catálogo desde el servidor…" />;
  if (error) return <ErrorCarga mensaje={error} onReintentar={recargar} />;

  const productosFiltrados =
    categoriaSeleccionada === 'Todas'
      ? productos
      : productos.filter((p) => p.categoria === categoriaSeleccionada);

  return (
    <div className="mx-auto my-6 max-w-6xl px-4">
      <h2 className="mb-2 text-center text-2xl font-bold text-gray-900 dark:text-white">
        Catálogo de Productos
      </h2>
      <p className="mb-6 text-center text-sm text-gray-500 dark:text-gray-400">
        Inventario disponible en la bodega de San Bernardo, actualizado desde el servidor.
      </p>

      <div className="mb-6 flex flex-wrap justify-center gap-2">
        {categorias.map((cat) => (
          <button
            key={cat}
            type="button"
            className={boton(
              categoriaSeleccionada === cat ? 'primario' : 'bordeOscuro',
              'px-3 py-1.5 text-xs'
            )}
            onClick={() => seleccionarCategoria(cat)}
          >
            {cat}
          </button>
        ))}
      </div>

      <div className="mb-3 flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          {categoriaSeleccionada}
        </h3>
        <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-600 dark:bg-gray-800 dark:text-gray-300">
          {productosFiltrados.length}{' '}
          {productosFiltrados.length === 1 ? 'producto' : 'productos'}
        </span>
      </div>

      {productosFiltrados.length > 0 ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {productosFiltrados.map((item) => (
            <ProductoCard key={item.id} producto={item} agregarAlCarrito={agregarAlCarrito} />
          ))}
        </div>
      ) : (
        <div className="py-12 text-center">
          <p className="text-base text-gray-500 dark:text-gray-400">
            No hay productos disponibles en esta categoría.
          </p>
        </div>
      )}
    </div>
  );
};
