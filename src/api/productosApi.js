import { request } from './clienteApi';

// listado y detalle son publicos, el resto exige rol admin
export const obtenerProductos = () => request('/productos');

export const obtenerProducto = (id) => request(`/productos/${id}`);

export const crearProducto = (producto) =>
  request('/productos', { metodo: 'POST', cuerpo: producto });

export const actualizarProducto = (id, producto) =>
  request(`/productos/${id}`, { metodo: 'PUT', cuerpo: producto });

export const eliminarProducto = (id) =>
  request(`/productos/${id}`, { metodo: 'DELETE' });
