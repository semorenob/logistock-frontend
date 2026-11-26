import React, { useState } from 'react';
import { crearProducto, actualizarProducto } from '../api/productosApi';
import { boton, campoTexto, etiquetaCampo } from '../utils/estilos';

const PRODUCTO_VACIO = {
  nombre: '',
  descripcion: '',
  precio: '',
  stock: '',
  categoria: '',
  imagenUrl: '',
};

// modal con el formulario para crear o editar un producto contra la api.
// cuando productoInicial es null se trata de una creacion
export const FormularioProducto = ({ productoInicial, categorias = [], onCerrar, onGuardado }) => {
  const esEdicion = productoInicial != null;
  const [form, setForm] = useState(() => ({
    ...PRODUCTO_VACIO,
    ...(productoInicial ?? {}),
  }));
  const [error, setError] = useState(null);
  const [guardando, setGuardando] = useState(false);

  const cambiarCampo = (campo) => (e) => setForm({ ...form, [campo]: e.target.value });

  const guardar = async (e) => {
    e.preventDefault();
    setError(null);
    setGuardando(true);
    const cuerpo = {
      nombre: form.nombre,
      descripcion: form.descripcion,
      precio: Number(form.precio),
      stock: Number(form.stock),
      categoria: form.categoria,
      imagenUrl: form.imagenUrl,
    };
    try {
      const producto = esEdicion
        ? await actualizarProducto(productoInicial.id, cuerpo)
        : await crearProducto(cuerpo);
      onGuardado(producto, esEdicion);
    } catch (err) {
      setError(err.message ?? 'No se pudo guardar el producto');
    } finally {
      setGuardando(false);
    }
  };

  return (
    <div
      className="fixed inset-0 flex items-center justify-center bg-black/50 p-4"
      style={{ zIndex: 1070 }}
      role="dialog"
      aria-modal="true"
      aria-labelledby="titulo-form-producto"
    >
      <div className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-2xl bg-white p-6 shadow-2xl dark:bg-gray-800">
        <div className="mb-4 flex items-center justify-between">
          <h3
            id="titulo-form-producto"
            className="text-lg font-bold text-gray-900 dark:text-white"
          >
            {esEdicion ? 'Editar producto' : 'Nuevo producto'}
          </h3>
          <button
            type="button"
            className="rounded-md p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-600 dark:hover:bg-gray-700 dark:hover:text-gray-200"
            aria-label="Cerrar formulario"
            onClick={onCerrar}
          >
            <svg className="h-5 w-5" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M5 5l10 10M15 5L5 15" strokeLinecap="round" />
            </svg>
          </button>
        </div>

        {error && (
          <div
            role="alert"
            className="mb-4 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700 dark:border-red-800 dark:bg-red-950/50 dark:text-red-300"
          >
            {error}
          </div>
        )}

        <form onSubmit={guardar}>
          <div className="mb-3">
            <label className={etiquetaCampo} htmlFor="form-nombre">Nombre*</label>
            <input
              id="form-nombre"
              type="text"
              className={campoTexto}
              required
              value={form.nombre}
              onChange={cambiarCampo('nombre')}
            />
          </div>
          <div className="mb-3">
            <label className={etiquetaCampo} htmlFor="form-descripcion">Descripción</label>
            <textarea
              id="form-descripcion"
              rows="2"
              className={campoTexto}
              placeholder="Ej.: OFERTA de lanzamiento, incluye garantía de 1 año"
              value={form.descripcion}
              onChange={cambiarCampo('descripcion')}
            />
            <p className="mt-1 text-xs text-gray-400">
              Si la descripción contiene la palabra «oferta», el producto aparece en Ofertas.
            </p>
          </div>
          <div className="mb-3 grid gap-3 sm:grid-cols-2">
            <div>
              <label className={etiquetaCampo} htmlFor="form-precio">Precio (CLP)*</label>
              <input
                id="form-precio"
                type="number"
                min="0"
                step="1"
                className={campoTexto}
                required
                value={form.precio}
                onChange={cambiarCampo('precio')}
              />
            </div>
            <div>
              <label className={etiquetaCampo} htmlFor="form-stock">Stock*</label>
              <input
                id="form-stock"
                type="number"
                min="0"
                step="1"
                className={campoTexto}
                required
                value={form.stock}
                onChange={cambiarCampo('stock')}
              />
            </div>
          </div>
          <div className="mb-4">
            <label className={etiquetaCampo} htmlFor="form-categoria">Categoría</label>
            <input
              id="form-categoria"
              type="text"
              className={campoTexto}
              list="categorias-existentes"
              placeholder="Ej.: Electrónica"
              value={form.categoria}
              onChange={cambiarCampo('categoria')}
            />
            <datalist id="categorias-existentes">
              {categorias.map((cat) => (
                <option key={cat} value={cat} />
              ))}
            </datalist>
          </div>
          <div className="mb-5">
            <label className={etiquetaCampo} htmlFor="form-imagen">URL de imagen</label>
            <input
              id="form-imagen"
              type="url"
              className={campoTexto}
              placeholder="https://…"
              value={form.imagenUrl}
              onChange={cambiarCampo('imagenUrl')}
            />
          </div>

          <div className="flex justify-end gap-2">
            <button type="button" className={boton('secundario')} onClick={onCerrar}>
              Cancelar
            </button>
            <button type="submit" className={boton('primario')} disabled={guardando}>
              {guardando
                ? 'Guardando…'
                : esEdicion
                  ? 'Guardar cambios'
                  : 'Crear producto'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
