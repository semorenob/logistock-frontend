import React, { useState } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { AvisoFlotante } from '../components/AvisoFlotante';
import { clp } from '../utils/formato';
import { boton, campoSoloLectura, etiquetaCampo } from '../utils/estilos';

export const CompraExitosa = ({ ordenData }) => {
  const [aviso, setAviso] = useState(null);

  if (!ordenData) {
    return <Navigate to="/" replace />;
  }

  const { cliente = {}, productos = [], total = 0, ordenId = '—' } = ordenData;

  return (
    <div className="mx-auto my-8 max-w-4xl px-4">
      <div className="rounded-3xl bg-white p-6 shadow-xl ring-1 ring-black/5 md:p-8 dark:bg-gray-800 dark:ring-white/10">
        <div className="mb-6 flex flex-wrap items-start justify-between gap-3 border-b border-gray-100 pb-4 dark:border-gray-700">
          <div>
            <div className="flex items-center gap-2">
              <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-emerald-500 text-white">
                ✓
              </span>
              <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                Se ha realizado la compra. nro #{ordenId}
              </h3>
            </div>
            <p className="mb-0 ml-10 text-sm text-gray-500 dark:text-gray-400">
              Detalle del pedido realizado
            </p>
          </div>
          <span className="rounded-full bg-gray-100 px-3 py-1 text-sm font-medium text-gray-600 dark:bg-gray-700 dark:text-gray-300">
            Código orden: ORDER{ordenId}
          </span>
        </div>

        <div className="mb-6 grid gap-3 md:grid-cols-3">
          <div>
            <label className={etiquetaCampo}>Nombre*</label>
            <input type="text" className={campoSoloLectura} value={cliente.nombre || ''} readOnly />
          </div>
          <div>
            <label className={etiquetaCampo}>Apellidos*</label>
            <input type="text" className={campoSoloLectura} value={cliente.apellidos || ''} readOnly />
          </div>
          <div>
            <label className={etiquetaCampo}>Correo*</label>
            <input type="email" className={campoSoloLectura} value={cliente.correo || ''} readOnly />
          </div>

          <div className="md:col-span-3">
            <h6 className="mb-2 mt-2 text-sm font-bold text-gray-900 dark:text-white">
              Dirección de entrega de los productos
            </h6>
          </div>

          <div className="md:col-span-2">
            <label className={etiquetaCampo}>Calle*</label>
            <input type="text" className={campoSoloLectura} value={cliente.calle || ''} readOnly />
          </div>
          <div>
            <label className={etiquetaCampo}>Departamento (opcional)</label>
            <input
              type="text"
              className={campoSoloLectura}
              value={cliente.departamento || ''}
              readOnly
            />
          </div>
          <div>
            <label className={etiquetaCampo}>Región*</label>
            <input type="text" className={campoSoloLectura} value={cliente.region || ''} readOnly />
          </div>
          <div className="md:col-span-2">
            <label className={etiquetaCampo}>Comuna*</label>
            <input type="text" className={campoSoloLectura} value={cliente.comuna || ''} readOnly />
          </div>

          <div className="md:col-span-3">
            <label className={etiquetaCampo}>Indicaciones para la entrega (opcional)</label>
            <textarea
              rows="2"
              className={campoSoloLectura}
              value={cliente.indicaciones || ''}
              readOnly
            />
          </div>
        </div>

        <div className="mb-6 overflow-x-auto">
          <table className="w-full border-t border-gray-100 text-left text-sm dark:border-gray-700">
            <thead className="bg-gray-50 text-xs uppercase tracking-wide text-gray-500 dark:bg-gray-700/50 dark:text-gray-300">
              <tr>
                <th className="px-3 py-2">Imagen</th>
                <th className="px-3 py-2">Nombre</th>
                <th className="px-3 py-2 text-right">Precio</th>
                <th className="px-3 py-2 text-center">Cantidad</th>
                <th className="px-3 py-2 text-right">Subtotal</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
              {productos &&
                productos.map((item) => (
                  <tr key={item.id}>
                    <td className="px-3 py-2">
                      <img
                        src={item.imagenUrl || 'https://placehold.co/45x45/e5e7eb/9ca3af?text=%20'}
                        alt={item.nombre}
                        className="h-11 w-11 rounded-md object-contain"
                      />
                    </td>
                    <td className="px-3 py-2 font-semibold text-gray-900 dark:text-white">
                      {item.nombre}
                    </td>
                    <td className="px-3 py-2 text-right text-gray-700 dark:text-gray-300">
                      ${clp(item.precio)}
                    </td>
                    <td className="px-3 py-2 text-center dark:text-gray-300">{item.cantidad}</td>
                    <td className="px-3 py-2 text-right font-bold text-gray-900 dark:text-white">
                      ${clp(item.precio * item.cantidad)}
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>

        <div className="mb-6 rounded-2xl bg-gray-50 p-4 text-center dark:bg-gray-700/50">
          <h4 className="text-xl font-bold text-gray-900 dark:text-white">
            Total pagado: ${clp(total)}
          </h4>
        </div>

        <div className="flex flex-wrap justify-center gap-3">
          <button className={boton('oscuro', 'px-5')} onClick={() => window.print()}>
            🖨️ Imprimir boleta en PDF
          </button>
          <button
            className={boton('exito', 'px-5')}
            onClick={() =>
              setAviso({
                tipo: 'success',
                titulo: 'Boleta enviada',
                mensaje: `Se envió la boleta al correo ${cliente.correo}`,
              })
            }
          >
            ✉️ Enviar boleta por email
          </button>
          <Link to="/categorias" className={boton('oscuro', 'px-5')}>
            Ir a la Tienda
          </Link>
        </div>
      </div>

      <AvisoFlotante
        mensaje={aviso?.mensaje}
        titulo={aviso?.titulo}
        tipo={aviso?.tipo}
        onClose={() => setAviso(null)}
      />
    </div>
  );
};
