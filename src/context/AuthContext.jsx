import { createContext, useCallback, useContext, useMemo, useState } from 'react';
import { iniciarSesion, registrar } from '../api/autenticacionApi';
import { guardarSesion, limpiarSesion, obtenerUsuario } from '../utils/sesion';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  // al abrir la app se recupera la sesion guardada para no pedir login otra vez
  const [usuario, setUsuario] = useState(obtenerUsuario);

  const login = useCallback(async (email, password) => {
    const sesion = await iniciarSesion({ email, password });
    const guardado = guardarSesion(sesion);
    setUsuario(guardado);
    return guardado;
  }, []);

  const registro = useCallback(async (datos) => {
    const sesion = await registrar(datos);
    const guardado = guardarSesion(sesion);
    setUsuario(guardado);
    return guardado;
  }, []);

  const logout = useCallback(() => {
    limpiarSesion();
    setUsuario(null);
  }, []);

  const valor = useMemo(
    () => ({
      usuario,
      autenticado: Boolean(usuario),
      esAdmin: usuario?.rol === 'ADMIN',
      login,
      registro,
      logout,
    }),
    [usuario, login, registro, logout]
  );

  return <AuthContext.Provider value={valor}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const contexto = useContext(AuthContext);
  if (!contexto) {
    throw new Error('useAuth debe usarse dentro de un AuthProvider');
  }
  return contexto;
};
