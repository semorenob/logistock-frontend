import { obtenerToken } from '../utils/sesion';

// url base del backend, se puede cambiar con un archivo .env (VITE_API_URL)
export const API_BASE =
  import.meta.env.VITE_API_URL ?? 'http://localhost:8080/api';

export class ApiError extends Error {
  constructor(mensaje, status) {
    super(mensaje);
    this.name = 'ApiError';
    this.status = status;
  }
}

const MENSAJES_POR_ESTADO = {
  400: 'La solicitud es inválida. Revisa los datos enviados.',
  401: 'Credenciales inválidas o sesión expirada. Vuelve a iniciar sesión.',
  403: 'No tienes permisos (rol ADMIN) para realizar esta acción.',
  404: 'El recurso solicitado no existe.',
  500: 'Error interno del servidor. Intenta nuevamente.',
};

// cliente fetch para hablar con el backend. agrega el token de la sesion
// automaticamente y traduce los errores http a mensajes simples
export async function request(ruta, { metodo = 'GET', cuerpo } = {}) {
  const headers = {};
  if (cuerpo !== undefined) headers['Content-Type'] = 'application/json';

  const token = obtenerToken();
  if (token) headers.Authorization = `Bearer ${token}`;

  let respuesta;
  try {
    respuesta = await fetch(`${API_BASE}${ruta}`, {
      method: metodo,
      headers,
      body: cuerpo !== undefined ? JSON.stringify(cuerpo) : undefined,
    });
  } catch {
    throw new ApiError(
      'No se pudo conectar con el servidor. Verifica que el backend esté corriendo.',
      0
    );
  }

  if (!respuesta.ok) {
    let detalle = null;
    try {
      const data = await respuesta.json();
      detalle = data?.message ?? data?.error ?? null;
    } catch {
      // la respuesta no trae cuerpo json
    }
    throw new ApiError(
      detalle ?? MENSAJES_POR_ESTADO[respuesta.status] ?? `Error ${respuesta.status}`,
      respuesta.status
    );
  }

  if (respuesta.status === 204) return null;
  return respuesta.json();
}
