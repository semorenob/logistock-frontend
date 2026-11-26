// utilidades de formato compartidas por la tienda

export const clp = (valor) =>
  (valor ?? 0).toLocaleString('es-CL', { maximumFractionDigits: 0 });

// el backend no tiene un campo de oferta, asi que se usa esta regla:
// un producto esta en oferta cuando su descripcion contiene la palabra
// "oferta", la que escribe el administrador
export const estaEnOferta = (producto) =>
  Boolean(producto?.descripcion?.toLowerCase().includes('oferta'));

export const STOCK_CRITICO = 20;
