import React from 'react';
import { Link } from 'react-router-dom';
import { useProductos } from '../hooks/useProductos';
import { useCarrito } from '../context/CarritoContext';
import { ProductoCard } from '../components/ProductoCard';
import { Cargando, ErrorCarga } from '../components/EstadoCarga';
import { estaEnOferta } from '../utils/formato';
import { boton } from '../utils/estilos';

const iconosCategoria = {
  Electrónica: '🖥️',
  Calzado: '👟',
  Vestuario: '🧥',
  Alimentos: '🥫',
};

export const Home = () => {
  const { productos, cargando, error, recargar } = useProductos();
  const { agregarAlCarrito } = useCarrito();

  if (cargando) return <Cargando mensaje="Cargando catálogo desde el servidor…" />;
  if (error) return <ErrorCarga mensaje={error} onReintentar={recargar} />;

  const ofertas = productos.filter(estaEnOferta).slice(0, 4);
  const totalOfertas = productos.filter(estaEnOferta).length;
  const categorias = [...new Set(productos.map((p) => p.categoria).filter(Boolean))];

  return (
    <div className="mx-auto my-6 max-w-6xl px-4">
      <section className="mb-10 rounded-3xl bg-gray-900 p-8 text-center text-white md:p-12 dark:bg-black">
        <span className="mb-4 inline-block rounded-full bg-amber-400 px-3 py-1 text-xs font-bold text-gray-900">
          📦 Bodega San Bernardo · 5.000 m²
        </span>
        <h1 className="text-4xl font-bold md:text-5xl">Retail y Tecnología</h1>
        <p className="mx-auto mb-6 mt-3 max-w-2xl text-lg text-white/60">
          Productos de nuestras marcas y clientes con inventario en tiempo real,
          trazabilidad por ubicación y despacho directo desde nuestra bodega.
        </p>
        <div className="flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Link to="/ofertas" className={boton('advertencia', 'px-6 py-3 text-base')}>
            Ver Ofertas 🔥
          </Link>
          <Link to="/categorias" className={boton('bordeClaro', 'px-6 py-3 text-base')}>
            Explorar Catálogo
          </Link>
        </div>
        <div className="mx-auto mt-8 grid max-w-lg grid-cols-3 gap-3">
          <div>
            <div className="text-2xl font-bold">{productos.length}</div>
            <small className="text-white/60">Productos</small>
          </div>
          <div>
            <div className="text-2xl font-bold">{categorias.length}</div>
            <small className="text-white/60">Categorías</small>
          </div>
          <div>
            <div className="text-2xl font-bold text-amber-400">{totalOfertas}</div>
            <small className="text-white/60">Ofertas activas</small>
          </div>
        </div>
      </section>

      {categorias.length > 0 && (
        <section className="mb-10">
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">Categorías</h2>
            <Link to="/categorias" className={boton('bordeOscuro', 'px-3 py-1.5 text-xs')}>
              Ver todas
            </Link>
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {categorias.map((cat) => {
              const cantidad = productos.filter((p) => p.categoria === cat).length;
              return (
                <Link
                  key={cat}
                  to={`/categorias?cat=${encodeURIComponent(cat)}`}
                  className="block rounded-xl bg-white p-6 text-center shadow-sm ring-1 ring-black/5 transition-shadow hover:shadow-md dark:bg-gray-800 dark:ring-white/10"
                >
                  <div className="mb-2 text-4xl">{iconosCategoria[cat] || '🛍️'}</div>
                  <h5 className="mb-1 text-base font-semibold text-gray-900 dark:text-white">
                    {cat}
                  </h5>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {cantidad} {cantidad === 1 ? 'producto' : 'productos'}
                  </p>
                </Link>
              );
            })}
          </div>
        </section>
      )}

      <section className="mb-10">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-xl font-bold text-red-600 dark:text-red-400">
            🔥 Ofertas del momento
          </h2>
          <Link to="/ofertas" className={boton('bordeRojo', 'px-3 py-1.5 text-xs')}>
            Ver todas
          </Link>
        </div>
        {ofertas.length > 0 ? (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {ofertas.map((item) => (
              <ProductoCard key={item.id} producto={item} agregarAlCarrito={agregarAlCarrito} />
            ))}
          </div>
        ) : (
          <p className="py-8 text-center text-gray-500 dark:text-gray-400">
            No hay ofertas activas en este momento.
          </p>
        )}
      </section>

      <section className="mb-3 grid gap-6 border-t border-gray-200 pt-8 text-center md:grid-cols-3 dark:border-gray-800">
        <div>
          <div className="mb-2 text-3xl">🚚</div>
          <h5 className="mb-1 font-semibold text-gray-900 dark:text-white">
            Despacho 24 a 48 horas
          </h5>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Preparamos y despachamos tu pedido con seguimiento en todo el país.
          </p>
        </div>
        <div>
          <div className="mb-2 text-3xl">📦</div>
          <h5 className="mb-1 font-semibold text-gray-900 dark:text-white">
            Stock en tiempo real
          </h5>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Cada ingreso, egreso o traslado se refleja al instante en el inventario.
          </p>
        </div>
        <div>
          <div className="mb-2 text-3xl">🔒</div>
          <h5 className="mb-1 font-semibold text-gray-900 dark:text-white">Datos protegidos</h5>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Acceso con JWT: las operaciones de inventario requieren rol ADMIN.
          </p>
        </div>
      </section>
    </div>
  );
};
