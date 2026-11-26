import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { eliminarProducto } from '../api/productosApi';
import { useProductos } from '../hooks/useProductos';
import { AvisoFlotante } from '../components/AvisoFlotante';
import { ConfirmacionFlotante } from '../components/ConfirmacionFlotante';
import { FormularioProducto } from '../components/FormularioProducto';
import { Cargando, ErrorCarga } from '../components/EstadoCarga';
import { clp, estaEnOferta, STOCK_CRITICO } from '../utils/formato';
import { boton, botonPequeno, campoTexto, etiquetaCampo } from '../utils/estilos';

const menuItems = [
  { key: 'dashboard', label: 'Dashboard', icono: '⏱️' },
  { key: 'ordenes', label: 'Movimientos', icono: '🔄' },
  { key: 'productos', label: 'Productos', icono: '📦' },
  { key: 'categorias', label: 'Categorías', icono: '🏷️' },
  { key: 'usuarios', label: 'Usuarios', icono: '👥' },
  { key: 'reportes', label: 'Reportes', icono: '📊' },
  { key: 'perfil', label: 'Perfil', icono: '👤' },
];

const Badge = ({ color, children }) => (
  <span className={`inline-block rounded-full px-2 py-0.5 text-xs font-semibold ${color}`}>
    {children}
  </span>
);

export const AdminDashboard = () => {
  const { usuario, logout } = useAuth();
  const { productos, cargando, error, recargar, setProductos } = useProductos();
  const [seccionActiva, setSeccionActiva] = useState('dashboard');
  const [productoAEliminar, setProductoAEliminar] = useState(null);
  const [aviso, setAviso] = useState(null);
  const [editando, setEditando] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    document.title = 'LogiStock · Panel de administración';
  }, []);

  const totalUnidades = productos.reduce((acc, p) => acc + (p.stock || 0), 0);
  const totalOfertas = productos.filter(estaEnOferta).length;
  const stockCritico = productos.filter((p) => (p.stock ?? 0) <= STOCK_CRITICO).length;
  const categorias = useMemo(
    () => [...new Set(productos.map((p) => p.categoria).filter(Boolean))],
    [productos]
  );

  const confirmarEliminacion = async () => {
    if (!productoAEliminar) return;
    try {
      await eliminarProducto(productoAEliminar.id);
      setProductos((prev) => prev.filter((p) => p.id !== productoAEliminar.id));
      setAviso({
        tipo: 'success',
        titulo: 'Producto eliminado',
        mensaje: `«${productoAEliminar.nombre}» se quitó del inventario.`,
      });
    } catch (err) {
      setAviso({ tipo: 'danger', titulo: 'No se pudo eliminar', mensaje: err.message });
    } finally {
      setProductoAEliminar(null);
    }
  };

  const productoGuardado = (producto, esEdicion) => {
    setProductos((prev) =>
      esEdicion
        ? prev.map((p) => (p.id === producto.id ? producto : p))
        : [...prev, producto]
    );
    setEditando(null);
    setAviso({
      tipo: 'success',
      titulo: esEdicion ? 'Producto actualizado' : 'Producto creado',
      mensaje: `«${producto.nombre}» se guardó correctamente.`,
    });
  };

  return (
    <div className="flex min-h-screen flex-col bg-gray-50 text-gray-900 md:flex-row dark:bg-gray-950 dark:text-gray-100">
      <aside className="flex flex-col justify-between bg-gray-900 p-5 text-white md:w-64 lg:w-56 dark:bg-black">
        <div>
          <h5 className="text-lg font-bold">LogiStock</h5>
          <p className="mb-5 text-xs text-white/50">Gestión de inventario</p>
          <ul className="flex flex-row flex-wrap gap-1 md:flex-col">
            {menuItems.map((item) => (
              <li key={item.key}>
                <button
                  type="button"
                  className={`w-full rounded-lg px-3 py-2 text-left text-sm transition-colors ${
                    seccionActiva === item.key
                      ? 'bg-blue-600 font-semibold text-white'
                      : 'text-white/60 hover:bg-white/10'
                  }`}
                  onClick={() => setSeccionActiva(item.key)}
                >
                  <span className="mr-2">{item.icono}</span>
                  {item.label}
                </button>
              </li>
            ))}
          </ul>
        </div>
        <div className="mt-4 flex flex-col gap-2">
          <p className="truncate text-xs text-white/50">
            Sesión: {usuario?.nombre} · <span className="font-bold">{usuario?.rol}</span>
          </p>
          <button
            type="button"
            className={boton('secundario', 'w-full')}
            onClick={() => navigate('/categorias')}
          >
            🏬 Tienda
          </button>
          <button type="button" className={boton('peligro', 'w-full')} onClick={logout}>
            Cerrar Sesión
          </button>
        </div>
      </aside>

      <main className="flex-1 p-6">
        {seccionActiva === 'dashboard' && (
          <>
            <div className="mb-6">
              <h2 className="text-2xl font-bold">Dashboard</h2>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Resumen del inventario, sincronizado con la API del backend.
              </p>
            </div>

            {cargando ? (
              <Cargando mensaje="Sincronizando inventario…" />
            ) : error ? (
              <ErrorCarga mensaje={error} onReintentar={recargar} />
            ) : (
              <>
                <div className="mb-6 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
                  <div className="rounded-2xl bg-blue-600 p-4 text-white shadow-sm">
                    <div className="flex items-center justify-between">
                      <div>
                        <h6 className="mb-1 text-xs font-medium text-white/70">
                          Productos registrados
                        </h6>
                        <h2 className="text-3xl font-bold">{productos.length}</h2>
                      </div>
                      <span className="text-3xl">📦</span>
                    </div>
                    <small className="mt-2 block text-white/70">
                      Catálogo activo en la base de datos
                    </small>
                  </div>

                  <div className="rounded-2xl bg-emerald-600 p-4 text-white shadow-sm">
                    <div className="flex items-center justify-between">
                      <div>
                        <h6 className="mb-1 text-xs font-medium text-white/70">
                          Unidades en stock
                        </h6>
                        <h2 className="text-3xl font-bold">{clp(totalUnidades)}</h2>
                      </div>
                      <span className="text-3xl">🏬</span>
                    </div>
                    <small className="mt-2 block text-white/70">
                      Suma del stock de todos los productos
                    </small>
                  </div>

                  <div className="rounded-2xl bg-amber-400 p-4 text-gray-900 shadow-sm">
                    <div className="flex items-center justify-between">
                      <div>
                        <h6 className="mb-1 text-xs font-medium text-gray-700">Ofertas activas</h6>
                        <h2 className="text-3xl font-bold">{totalOfertas}</h2>
                      </div>
                      <span className="text-3xl">🔥</span>
                    </div>
                    <small className="mt-2 block text-gray-700">
                      Descripción contiene «oferta»
                    </small>
                  </div>

                  <div className="rounded-2xl bg-red-600 p-4 text-white shadow-sm">
                    <div className="flex items-center justify-between">
                      <div>
                        <h6 className="mb-1 text-xs font-medium text-white/70">
                          Stock crítico (≤ {STOCK_CRITICO} uds.)
                        </h6>
                        <h2 className="text-3xl font-bold">{stockCritico}</h2>
                      </div>
                      <span className="text-3xl">⚠️</span>
                    </div>
                    <small className="mt-2 block text-white/70">Requiere reposición pronto</small>
                  </div>
                </div>

                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                  {menuItems.map((mod) => (
                    <button
                      key={mod.key}
                      type="button"
                      className="cursor-pointer rounded-xl bg-white p-4 text-center shadow-sm ring-1 ring-black/5 transition-shadow hover:shadow-md dark:bg-gray-800 dark:ring-white/10"
                      onClick={() => setSeccionActiva(mod.key)}
                    >
                      <div className="mb-2 text-3xl">{mod.icono}</div>
                      <h6 className="font-bold text-gray-900 dark:text-white">{mod.label}</h6>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        Gestionar módulo de {mod.label.toLowerCase()}
                      </p>
                    </button>
                  ))}
                </div>
              </>
            )}
          </>
        )}

        {seccionActiva === 'ordenes' && (
          <div>
            <h3 className="mb-1 text-xl font-bold">Movimientos de Inventario</h3>
            <p className="mb-4 text-sm text-gray-500 dark:text-gray-400">
              Ingresos, egresos, ajustes y traslados registrados en la bodega.
            </p>
            <div className="overflow-x-auto rounded-xl bg-white shadow-sm ring-1 ring-black/5 dark:bg-gray-800 dark:ring-white/10">
              <table className="w-full text-left text-sm">
                <thead className="bg-gray-900 text-xs uppercase tracking-wide text-white">
                  <tr>
                    <th className="px-4 py-3">N° Movimiento</th>
                    <th className="px-4 py-3">Tipo</th>
                    <th className="px-4 py-3">Cliente</th>
                    <th className="px-4 py-3">Producto</th>
                    <th className="px-4 py-3">Cantidad</th>
                    <th className="px-4 py-3">Responsable</th>
                    <th className="px-4 py-3">Estado</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                  {[
                    ['#1042', 'ING', 'TechStore', 'Notebook HP 15', '+45', 'Bodeguero', 'En Recepción'],
                    ['#1041', 'EGR', 'ModaHoy', 'Zapatillas Nike Air', '-20', 'Bodeguero', 'Ingresado'],
                    ['#1040', 'AJU', 'Alimentos Sanos', 'Arroz 1kg (Pack 10)', '-5', 'Coordinador de Inventario', 'Con Discrepancia'],
                    ['#1039', 'TRAS', 'TechStore', 'Monitor Samsung 24', '10', 'Bodeguero', 'Completado'],
                    ['#1038', 'ING', 'Alimentos Sanos', 'Aceite 1L (Pack 6)', '+350', 'Bodeguero', 'Programado'],
                  ].map((fila) => (
                    <tr key={fila[0]} className="text-gray-700 dark:text-gray-300">
                      <td className="px-4 py-3">{fila[0]}</td>
                      <td className="px-4 py-3">
                        <Badge color="bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300">
                          {fila[1]}
                        </Badge>
                      </td>
                      <td className="px-4 py-3">{fila[2]}</td>
                      <td className="px-4 py-3">{fila[3]}</td>
                      <td className="px-4 py-3 font-semibold">{fila[4]}</td>
                      <td className="px-4 py-3">{fila[5]}</td>
                      <td className="px-4 py-3">
                        <Badge color="bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300">
                          {fila[6]}
                        </Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="mt-2 text-xs text-gray-400">
              Sección de demostración: el backend actual no expone endpoint de movimientos.
            </p>
          </div>
        )}

        {seccionActiva === 'productos' && (
          <div>
            <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
              <h3 className="text-xl font-bold">Inventario de Productos</h3>
              <div className="flex gap-2">
                <button
                  type="button"
                  className={boton('bordeOscuro', 'px-3 py-1.5 text-xs')}
                  onClick={recargar}
                >
                  ↻ Recargar
                </button>
                <button
                  type="button"
                  className={boton('primario', 'px-3 py-1.5 text-xs')}
                  onClick={() => setEditando({})}
                >
                  + Nuevo producto
                </button>
              </div>
            </div>

            {cargando ? (
              <Cargando mensaje="Cargando inventario…" />
            ) : error ? (
              <ErrorCarga mensaje={error} onReintentar={recargar} />
            ) : (
              <div className="overflow-x-auto rounded-xl bg-white shadow-sm ring-1 ring-black/5 dark:bg-gray-800 dark:ring-white/10">
                <table className="w-full text-left text-sm">
                  <thead className="bg-gray-900 text-xs uppercase tracking-wide text-white">
                    <tr>
                      <th className="px-4 py-3">ID</th>
                      <th className="px-4 py-3">Nombre</th>
                      <th className="px-4 py-3">Descripción</th>
                      <th className="px-4 py-3">Categoría</th>
                      <th className="px-4 py-3 text-right">Stock</th>
                      <th className="px-4 py-3 text-right">Precio</th>
                      <th className="px-4 py-3 text-center">Acciones</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                    {productos.map((prod) => (
                      <tr key={prod.id} className="text-gray-700 dark:text-gray-300">
                        <td className="px-4 py-3 text-xs text-gray-400">{prod.id}</td>
                        <td className="px-4 py-3 font-semibold text-gray-900 dark:text-white">
                          {prod.nombre}
                          {estaEnOferta(prod) && (
                            <Badge color="ml-2 bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-300">
                              🔥 Oferta
                            </Badge>
                          )}
                        </td>
                        <td
                          className="max-w-56 truncate px-4 py-3 text-xs text-gray-500 dark:text-gray-400"
                          title={prod.descripcion}
                        >
                          {prod.descripcion || '—'}
                        </td>
                        <td className="px-4 py-3">{prod.categoria || '—'}</td>
                        <td
                          className={`px-4 py-3 text-right font-semibold ${
                            (prod.stock ?? 0) <= STOCK_CRITICO
                              ? 'text-amber-600 dark:text-amber-400'
                              : 'text-gray-900 dark:text-white'
                          }`}
                        >
                          {prod.stock}
                        </td>
                        <td className="px-4 py-3 text-right font-semibold text-gray-900 dark:text-white">
                          ${clp(prod.precio)}
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex justify-center gap-2">
                            <button
                              type="button"
                              className={botonPequeno('bordeOscuro')}
                              onClick={() => setEditando(prod)}
                            >
                              Editar
                            </button>
                            <button
                              type="button"
                              className={botonPequeno('bordeRojo')}
                              onClick={() => setProductoAEliminar(prod)}
                            >
                              Eliminar
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                    {productos.length === 0 && (
                      <tr>
                        <td colSpan="7" className="px-4 py-10 text-center text-sm text-gray-500 dark:text-gray-400">
                          No hay productos registrados. Crea el primero con «+ Nuevo producto».
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            )}
            <p className="mt-2 text-xs text-gray-400">
              Consejo: para que un producto aparezca en la página de Ofertas, incluye la
              palabra «oferta» en su descripción.
            </p>
          </div>
        )}

        {seccionActiva === 'categorias' && (
          <div>
            <h3 className="mb-4 text-xl font-bold">Categorías Registradas</h3>
            <ul className="max-w-xl divide-y divide-gray-100 rounded-xl bg-white shadow-sm ring-1 ring-black/5 dark:divide-gray-700 dark:bg-gray-800 dark:ring-white/10">
              {categorias.map((cat) => {
                const cantidad = productos.filter((p) => p.categoria === cat).length;
                return (
                  <li key={cat} className="flex items-center justify-between px-4 py-3 text-sm">
                    <span className="font-medium text-gray-900 dark:text-white">{cat}</span>
                    <Badge color="bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300">
                      {cantidad} {cantidad === 1 ? 'producto' : 'productos'}
                    </Badge>
                  </li>
                );
              })}
              {categorias.length === 0 && (
                <li className="px-4 py-6 text-center text-sm text-gray-500 dark:text-gray-400">
                  Sin categorías: se derivan de los productos existentes.
                </li>
              )}
            </ul>
          </div>
        )}

        {seccionActiva === 'usuarios' && (
          <div>
            <h3 className="mb-4 text-xl font-bold">Usuarios</h3>
            <div className="max-w-xl rounded-xl bg-white p-5 shadow-sm ring-1 ring-black/5 dark:bg-gray-800 dark:ring-white/10">
              <h6 className="mb-2 text-sm font-bold text-gray-900 dark:text-white">
                Sesión actual
              </h6>
              <p className="mb-1 text-sm text-gray-700 dark:text-gray-300">
                <strong>Nombre:</strong> {usuario?.nombre}
              </p>
              <p className="mb-1 text-sm text-gray-700 dark:text-gray-300">
                <strong>Correo:</strong> {usuario?.email}
              </p>
              <p className="text-sm text-gray-700 dark:text-gray-300">
                <strong>Rol:</strong>{' '}
                <Badge color="bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-300">
                  {usuario?.rol}
                </Badge>
              </p>
            </div>
            <div className="mt-3 max-w-xl rounded-xl border border-amber-300 bg-amber-50 p-4 text-xs text-amber-800 dark:border-amber-800 dark:bg-amber-950/50 dark:text-amber-300">
              Toda cuenta nueva se registra como cliente. Para ascender a alguien a
              administrador hay que cambiar su rol directamente en la base de datos,
              porque la api todavía no expone endpoints para listar usuarios ni editar
              su rol.
            </div>
          </div>
        )}

        {seccionActiva === 'reportes' && (
          <div>
            <h3 className="mb-1 text-xl font-bold">Reportes de Sistema</h3>
            <p className="mb-4 text-sm text-gray-500 dark:text-gray-400">
              Indicadores calculados en tiempo real desde el inventario del backend.
            </p>

            <div className="mb-4 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
              <div className="rounded-xl bg-white p-4 shadow-sm ring-1 ring-black/5 dark:bg-gray-800 dark:ring-white/10">
                <h6 className="mb-1 text-xs text-gray-500 dark:text-gray-400">
                  Productos registrados
                </h6>
                <h4 className="text-2xl font-bold">{productos.length}</h4>
                <small className="text-emerald-600 dark:text-emerald-400">
                  Sincronizado con la API
                </small>
              </div>
              <div className="rounded-xl bg-white p-4 shadow-sm ring-1 ring-black/5 dark:bg-gray-800 dark:ring-white/10">
                <h6 className="mb-1 text-xs text-gray-500 dark:text-gray-400">Unidades totales</h6>
                <h4 className="text-2xl font-bold">{clp(totalUnidades)}</h4>
                <small className="text-gray-400">Suma de stock disponible</small>
              </div>
              <div className="rounded-xl bg-white p-4 shadow-sm ring-1 ring-black/5 dark:bg-gray-800 dark:ring-white/10">
                <h6 className="mb-1 text-xs text-gray-500 dark:text-gray-400">Stock crítico</h6>
                <h4 className="mb-2 text-2xl font-bold">{stockCritico}</h4>
                <div className="h-1.5 overflow-hidden rounded-full bg-gray-200 dark:bg-gray-700">
                  <div
                    className="h-full rounded-full bg-red-500"
                    style={{
                      width: `${
                        productos.length
                          ? Math.round((stockCritico / productos.length) * 100)
                          : 0
                      }%`,
                    }}
                  />
                </div>
              </div>
              <div className="rounded-xl bg-white p-4 shadow-sm ring-1 ring-black/5 dark:bg-gray-800 dark:ring-white/10">
                <h6 className="mb-1 text-xs text-gray-500 dark:text-gray-400">Ofertas activas</h6>
                <h4 className="text-2xl font-bold">{totalOfertas}</h4>
                <small className="text-red-600 dark:text-red-400">
                  Descripción contiene «oferta»
                </small>
              </div>
            </div>

            <div className="mb-4 rounded-xl bg-white p-5 shadow-sm ring-1 ring-black/5 dark:bg-gray-800 dark:ring-white/10">
              <h5 className="mb-3 text-sm font-bold text-gray-900 dark:text-white">
                📉 Productos con stock crítico
              </h5>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead className="bg-gray-50 text-xs uppercase tracking-wide text-gray-500 dark:bg-gray-700/50 dark:text-gray-300">
                    <tr>
                      <th className="px-3 py-2">Producto</th>
                      <th className="px-3 py-2">Categoría</th>
                      <th className="px-3 py-2 text-right">Stock</th>
                      <th className="px-3 py-2 text-right">Precio</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                    {productos
                      .filter((p) => (p.stock ?? 0) <= STOCK_CRITICO)
                      .map((p) => (
                        <tr key={p.id}>
                          <td className="px-3 py-2 font-medium text-gray-900 dark:text-white">
                            {p.nombre}
                          </td>
                          <td className="px-3 py-2 text-gray-600 dark:text-gray-400">
                            {p.categoria || '—'}
                          </td>
                          <td className="px-3 py-2 text-right font-semibold text-amber-600 dark:text-amber-400">
                            {p.stock}
                          </td>
                          <td className="px-3 py-2 text-right text-gray-700 dark:text-gray-300">
                            ${clp(p.precio)}
                          </td>
                        </tr>
                      ))}
                    {stockCritico === 0 && (
                      <tr>
                        <td
                          colSpan="4"
                          className="px-3 py-6 text-center text-sm text-gray-500 dark:text-gray-400"
                        >
                          Sin productos con stock crítico. ¡Buen trabajo!
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="rounded-xl border border-sky-200 bg-sky-50 p-4 text-sm text-sky-900 dark:border-sky-800 dark:bg-sky-950/50 dark:text-sky-300">
              <h5 className="font-bold">📊 Proyección de capacidad</h5>
              <p className="mb-0">
                Los reportes se calculan con los datos reales de inventario entregados por{' '}
                <code>GET /api/productos</code>.
              </p>
            </div>
          </div>
        )}

        {seccionActiva === 'perfil' && (
          <div className="max-w-md rounded-xl bg-white p-5 shadow-sm ring-1 ring-black/5 dark:bg-gray-800 dark:ring-white/10">
            <h3 className="mb-4 text-xl font-bold">Perfil de administrador</h3>
            <div className="mb-3">
              <label className={etiquetaCampo}>Nombre de usuario</label>
              <input type="text" className={campoTexto} value={usuario?.nombre ?? ''} readOnly />
            </div>
            <div className="mb-3">
              <label className={etiquetaCampo}>Correo electrónico</label>
              <input type="email" className={campoTexto} value={usuario?.email ?? ''} readOnly />
            </div>
            <div>
              <label className={etiquetaCampo}>Rol</label>
              <input type="text" className={campoTexto} value={usuario?.rol ?? ''} readOnly />
            </div>
          </div>
        )}
      </main>

      {editando != null && (
        <FormularioProducto
          productoInicial={Object.keys(editando).length > 0 ? editando : null}
          categorias={categorias}
          onCerrar={() => setEditando(null)}
          onGuardado={productoGuardado}
        />
      )}

      <ConfirmacionFlotante
        mensaje={
          productoAEliminar
            ? `¿Deseas eliminar «${productoAEliminar.nombre}» del inventario?`
            : null
        }
        titulo="Eliminar producto"
        textoConfirmar="Eliminar"
        onConfirmar={confirmarEliminacion}
        onCancelar={() => setProductoAEliminar(null)}
      />

      <AvisoFlotante
        mensaje={aviso?.mensaje}
        titulo={aviso?.titulo}
        tipo={aviso?.tipo}
        onClose={() => setAviso(null)}
      />
    </div>
  );
};
