// persistencia local de la sesion: token y datos del usuario

const TOKEN_KEY = 'logistock_token';
const USUARIO_KEY = 'logistock_usuario';

export const obtenerToken = () => {
  try {
    return localStorage.getItem(TOKEN_KEY);
  } catch {
    return null;
  }
};

export const obtenerUsuario = () => {
  try {
    const data = localStorage.getItem(USUARIO_KEY);
    return data ? JSON.parse(data) : null;
  } catch {
    return null;
  }
};

export const guardarSesion = ({ token, email, nombre, rol }) => {
  const usuario = { email, nombre, rol };
  localStorage.setItem(TOKEN_KEY, token);
  localStorage.setItem(USUARIO_KEY, JSON.stringify(usuario));
  return usuario;
};

export const limpiarSesion = () => {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USUARIO_KEY);
};
