import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useCarrito } from '../context/CarritoContext';
import { useAuth } from '../context/AuthContext';
import { AvisoFlotante } from '../components/AvisoFlotante';
import { clp } from '../utils/formato';
import { boton, campoTexto, etiquetaCampo } from '../utils/estilos';

export const Carrito = ({ procesarPago }) => {
  const { carrito, eliminarDelCarrito, cambiarCantidad, totalCarrito } = useCarrito();
  const { usuario } = useAuth();
  const [aviso, setAviso] = useState(null);

  // si hay sesion iniciada se precargan los datos del usuario
  const [datosCliente, setDatosCliente] = useState({
    nombre: usuario?.nombre?.split(' ')[0] ?? '',
    apellidos: usuario?.nombre?.split(' ').slice(1).join(' ') ?? '',
    correo: usuario?.email ?? '',
    calle: '',
    departamento: '',
    region: 'Región Metropolitana de Santiago',
    comuna: '',
    indicaciones: '',
  });

  const actualizarCampo = (campo) => (e) => {
    setDatosCliente({ ...datosCliente, [campo]: e.target.value });
  };

  const handlePagar = (e) => {
    e.preventDefault();
    if (carrito.length === 0) {
      setAviso({
        tipo: 'warning',
        titulo: 'Carrito vacío',
        mensaje: 'Agrega productos al carrito antes de pagar.',
      });
      return;
    }
    procesarPago(datosCliente, true);
  };

  return (
    <div className="mx-auto my-6 max-w-6xl px-4">
      <h2 className="mb-6 text-2xl font-bold text-gray-900 dark:text-white">
        Carrito de Compras
      </h2>

      {carrito.length === 0 ? (
        <div className="rounded-xl bg-white p-8 text-center shadow-sm ring-1 ring-black/5 dark:bg-gray-800 dark:ring-white/10">
          <p className="mb-4 text-gray-500 dark:text-gray-400">El carrito de compras está vacío.</p>
          <div className="flex justify-center">
            <Link to="/categorias" className={boton('primario')}>
              Ver productos
            </Link>
          </div>
        </div>
      ) : (
        <div className="grid gap-6 lg:grid-cols-12">
          <div className="lg:col-span-7">
            <div className="overflow-x-auto rounded-xl bg-white shadow-sm ring-1 ring-black/5 dark:bg-gray-800 dark:ring-white/10">
              <table className="w-full text-left text-sm">
                <thead className="bg-gray-50 text-xs uppercase tracking-wide text-gray-500 dark:bg-gray-700/50 dark:text-gray-300">
                  <tr>
                    <th className="px-4 py-3">Producto</th>
                    <th className="px-4 py-3">Precio</th>
                    <th className="px-4 py-3 text-center">Cantidad</th>
                    <th className="px-4 py-3 text-right">Subtotal</th>
                    <th className="px-4 py-3"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                  {carrito.map((item) => (
                    <tr key={item.id}>
                      <td className="px-4 py-3 font-medium text-gray-900 dark:text-white">
                        {item.nombre}
                      </td>
                      <td className="px-4 py-3 text-gray-700 dark:text-gray-300">
                        ${clp(item.precio)}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center justify-center gap-1">
                          <button
                            type="button"
                            aria-label={`Restar una unidad de ${item.nombre}`}
                            className="h-7 w-7 rounded-md bg-gray-100 text-gray-700 hover:bg-gray-200 disabled:opacity-40 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600"
                            disabled={item.cantidad <= 1}
                            onClick={() => cambiarCantidad(item.id, item.cantidad - 1)}
                          >
                            −
                          </button>
                          <span
                            className="w-8 text-center font-semibold dark:text-white"
                            data-testid={`cantidad-${item.id}`}
                          >
                            {item.cantidad}
                          </span>
                          <button
                            type="button"
                            aria-label={`Sumar una unidad de ${item.nombre}`}
                            className="h-7 w-7 rounded-md bg-gray-100 text-gray-700 hover:bg-gray-200 disabled:opacity-40 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600"
                            disabled={item.cantidad >= (item.stock ?? Infinity)}
                            onClick={() => cambiarCantidad(item.id, item.cantidad + 1)}
                          >
                            +
                          </button>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-right font-semibold text-gray-900 dark:text-white">
                        ${clp(item.precio * item.cantidad)}
                      </td>
                      <td className="px-4 py-3 text-right">
                        <button
                          type="button"
                          className="rounded-md px-2 py-1 text-xs font-semibold text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-950/40"
                          onClick={() => eliminarDelCarrito(item.id)}
                        >
                          Eliminar
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <h4 className="mt-4 text-lg font-bold text-gray-900 dark:text-white">
              Total: ${clp(totalCarrito)}
            </h4>
            <Link to="/categorias" className={boton('bordeOscuro', 'mt-3')}>
              Seguir comprando
            </Link>
          </div>

          <div className="lg:col-span-5">
            <div className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-black/5 dark:bg-gray-800 dark:ring-white/10">
              <h5 className="mb-4 text-base font-bold text-gray-900 dark:text-white">
                Información del cliente
              </h5>
              <form onSubmit={handlePagar}>
                <div className="mb-3">
                  <label className={etiquetaCampo} htmlFor="carrito-nombre">Nombre*</label>
                  <input
                    id="carrito-nombre"
                    type="text"
                    className={campoTexto}
                    required
                    value={datosCliente.nombre}
                    onChange={actualizarCampo('nombre')}
                  />
                </div>
                <div className="mb-3">
                  <label className={etiquetaCampo} htmlFor="carrito-apellidos">Apellidos*</label>
                  <input
                    id="carrito-apellidos"
                    type="text"
                    className={campoTexto}
                    required
                    value={datosCliente.apellidos}
                    onChange={actualizarCampo('apellidos')}
                  />
                </div>
                <div className="mb-3">
                  <label className={etiquetaCampo} htmlFor="carrito-correo">
                    Correo Electrónico*
                  </label>
                  <input
                    id="carrito-correo"
                    type="email"
                    className={campoTexto}
                    required
                    value={datosCliente.correo}
                    onChange={actualizarCampo('correo')}
                  />
                </div>
                <div className="mb-3">
                  <label className={etiquetaCampo} htmlFor="carrito-calle">Calle*</label>
                  <input
                    id="carrito-calle"
                    type="text"
                    className={campoTexto}
                    required
                    value={datosCliente.calle}
                    onChange={actualizarCampo('calle')}
                  />
                </div>
                <div className="mb-3">
                  <label className={etiquetaCampo} htmlFor="carrito-depto">
                    Departamento (opcional)
                  </label>
                  <input
                    id="carrito-depto"
                    type="text"
                    className={campoTexto}
                    value={datosCliente.departamento}
                    onChange={actualizarCampo('departamento')}
                  />
                </div>
                <div className="mb-3">
                  <label className={etiquetaCampo} htmlFor="carrito-region">Región*</label>
                  <input
                    id="carrito-region"
                    type="text"
                    className={campoTexto}
                    required
                    value={datosCliente.region}
                    onChange={actualizarCampo('region')}
                  />
                </div>
                <div className="mb-3">
                  <label className={etiquetaCampo} htmlFor="carrito-comuna">Comuna*</label>
                  <input
                    id="carrito-comuna"
                    type="text"
                    className={campoTexto}
                    required
                    value={datosCliente.comuna}
                    onChange={actualizarCampo('comuna')}
                  />
                </div>
                <div className="mb-4">
                  <label className={etiquetaCampo} htmlFor="carrito-indicaciones">
                    Indicaciones para la entrega (opcional)
                  </label>
                  <textarea
                    id="carrito-indicaciones"
                    rows="2"
                    className={campoTexto}
                    value={datosCliente.indicaciones}
                    onChange={actualizarCampo('indicaciones')}
                  />
                </div>

                <button type="submit" className={boton('exito', 'w-full py-2.5')}>
                  Pagar ahora ${clp(totalCarrito)}
                </button>
              </form>
            </div>
          </div>
        </div>
      )}

      <AvisoFlotante
        mensaje={aviso?.mensaje}
        titulo={aviso?.titulo}
        tipo={aviso?.tipo}
        onClose={() => setAviso(null)}
      />
    </div>
  );
};
