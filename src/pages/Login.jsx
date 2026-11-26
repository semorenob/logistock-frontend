import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { boton, campoTexto, etiquetaCampo } from '../utils/estilos';

export const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const origen = location.state?.from?.pathname || '/';

  const [credenciales, setCredenciales] = useState({ email: '', password: '' });
  const [error, setError] = useState(null);
  const [enviando, setEnviando] = useState(false);

  const cambiar = (campo) => (e) =>
    setCredenciales({ ...credenciales, [campo]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setEnviando(true);
    try {
      const usuario = await login(credenciales.email, credenciales.password);
      // un administrador vuelve directo a su panel
      navigate(usuario.rol === 'ADMIN' ? '/admin' : origen, { replace: true });
    } catch (err) {
      setError(err.message ?? 'No se pudo iniciar sesión');
    } finally {
      setEnviando(false);
    }
  };

  return (
    <div className="mx-auto my-10 max-w-md px-4">
      <div className="rounded-2xl bg-white p-6 shadow-lg ring-1 ring-black/5 md:p-8 dark:bg-gray-800 dark:ring-white/10">
        <h2 className="mb-1 text-center text-2xl font-bold text-gray-900 dark:text-white">
          Iniciar sesión
        </h2>
        <p className="mb-6 text-center text-sm text-gray-500 dark:text-gray-400">
          Accede con tu cuenta para gestionar el inventario.
        </p>

        {error && (
          <div
            role="alert"
            className="mb-4 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700 dark:border-red-800 dark:bg-red-950/50 dark:text-red-300"
            data-testid="error-login"
          >
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className={etiquetaCampo} htmlFor="login-email">Correo electrónico</label>
            <input
              id="login-email"
              type="email"
              className={campoTexto}
              placeholder="admin@logistock.cl"
              required
              autoComplete="email"
              value={credenciales.email}
              onChange={cambiar('email')}
            />
          </div>
          <div className="mb-6">
            <label className={etiquetaCampo} htmlFor="login-password">Contraseña</label>
            <input
              id="login-password"
              type="password"
              className={campoTexto}
              placeholder="••••••••"
              required
              autoComplete="current-password"
              value={credenciales.password}
              onChange={cambiar('password')}
            />
          </div>

          <button
            type="submit"
            className={boton('primario', 'w-full py-2.5')}
            disabled={enviando}
          >
            {enviando ? 'Ingresando…' : 'Ingresar'}
          </button>
        </form>

        <p className="mt-4 text-center text-sm text-gray-500 dark:text-gray-400">
          ¿No tienes cuenta?{' '}
          <Link to="/registro" className="font-semibold text-blue-600 hover:underline dark:text-blue-400">
            Regístrate aquí
          </Link>
        </p>
      </div>
    </div>
  );
};
