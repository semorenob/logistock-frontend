import React from 'react';
import { Link, Navigate } from 'react-router-dom';
import { clp } from '../utils/formato';
import { boton } from '../utils/estilos';

export const PagoResultado = ({ exito, datosOrden }) => {
  if (!datosOrden) return <Navigate to="/" replace />;

  const { ordenId, cliente, productos, total } = datosOrden;

  return (
    <div className="mx-auto my-6 max-w-6xl px-4">
      {exito ? (
        <div className="rounded-xl border border-emerald-300 bg-white p-6 shadow-sm dark:border-emerald-800 dark:bg-gray-800">
          <div className="mb-4 text-center">
            <h3 className="text-xl font-bold text-emerald-600 dark:text-emerald-400">
              Se ha realizado la compra
            </h3>
            <h5 className="text-base font-semibold text-gray-700 dark:text-gray-300">
              Código ORDER: #{ordenId}
            </h5>
          </div>
          <div className="grid gap-6 md:grid-cols-2">
            <div>
              <h6 className="mb-2 text-sm font-bold text-gray-900 dark:text-white">
                Información del Cliente
              </h6>
              <p className="mb-1 text-sm text-gray-700 dark:text-gray-300">
                <strong>Nombre:</strong> {cliente.nombre} {cliente.apellidos}
              </p>
              <p className="mb-1 text-sm text-gray-700 dark:text-gray-300">
                <strong>Correo:</strong> {cliente.correo}
              </p>
              <p className="mb-1 text-sm text-gray-700 dark:text-gray-300">
                <strong>Dirección:</strong> {cliente.calle}, {cliente.comuna}
              </p>
            </div>
            <div>
              <h6 className="mb-2 text-sm font-bold text-gray-900 dark:text-white">
                Resumen de Productos
              </h6>
              <ul className="mb-3 divide-y divide-gray-100 rounded-lg bg-gray-50 dark:divide-gray-700 dark:bg-gray-700/50">
                {productos.map((p, idx) => (
                  <li key={idx} className="flex justify-between px-3 py-2 text-sm">
                    <span className="text-gray-700 dark:text-gray-300">
                      {p.nombre} (x{p.cantidad})
                    </span>
                    <span className="font-semibold text-gray-900 dark:text-white">
                      ${clp(p.precio * p.cantidad)}
                    </span>
                  </li>
                ))}
              </ul>
              <h5 className="text-right text-base font-bold text-gray-900 dark:text-white">
                Total Pagado: ${clp(total)}
              </h5>
            </div>
          </div>
          <Link to="/categorias" className={boton('primario', 'mt-4 w-full')}>
            Volver a la Tienda
          </Link>
        </div>
      ) : (
        <div className="rounded-xl border border-red-300 bg-white p-6 text-center shadow-sm dark:border-red-800 dark:bg-gray-800">
          <h3 className="text-xl font-bold text-red-600 dark:text-red-400">
            ❌ No se pudo realizar el pago
          </h3>
          <p className="text-sm text-gray-700 dark:text-gray-300">
            Nro de Orden Intentado: #{ordenId}
          </p>
          <div className="mt-4 flex flex-wrap justify-center gap-3">
            <Link to="/carrito" className={boton('advertencia')}>
              Volver a Intentar el Pago
            </Link>
            <Link to="/categorias" className={boton('secundario')}>
              Ir a Categorías
            </Link>
          </div>
        </div>
      )}
    </div>
  );
};
