import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { boton, campoTexto, etiquetaCampo } from '../utils/estilos';

export const Registro = () => {
  const { registro } = useAuth();
  const navigate = useNavigate();

  const [datos, setDatos] = useState({ nombre: '', email: '', password: '' });
  const [error, setError] = useState(null);
  const [enviando, setEnviando] = useState(false);

  const cambiar = (campo) => (e) => setDatos({ ...datos, [campo]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setEnviando(true);
    try {
      await registro(datos);
      navigate('/', { replace: true });
    } catch (err) {
      setError(err.message ?? 'No se pudo registrar la cuenta');
    } finally {
      setEnviando(false);
    }
  };

  return (
    <div className="mx-auto my-10 max-w-md px-4">
      <div className="rounded-2xl bg-white p-6 shadow-lg ring-1 ring-black/5 md:p-8 dark:bg-gray-800 dark:ring-white/10">
        <h2 className="mb-1 text-center text-2xl font-bold text-gray-900 dark:text-white">
          Crear cuenta
        </h2>
        <p className="mb-6 text-center text-sm text-gray-500 dark:text-gray-400">
          Crea tu cuenta de cliente para comprar en la tienda.
        </p>

        {error && (
          <div
            role="alert"
            className="mb-4 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700 dark:border-red-800 dark:bg-red-950/50 dark:text-red-300"
            data-testid="error-registro"
          >
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className={etiquetaCampo} htmlFor="registro-nombre">Nombre completo</label>
            <input
              id="registro-nombre"
              type="text"
              className={campoTexto}
              placeholder="Ana Pérez"
              required
              value={datos.nombre}
              onChange={cambiar('nombre')}
            />
          </div>
          <div className="mb-4">
            <label className={etiquetaCampo} htmlFor="registro-email">Correo electrónico</label>
            <input
              id="registro-email"
              type="email"
              className={campoTexto}
              placeholder="ana@ejemplo.cl"
              required
              autoComplete="email"
              value={datos.email}
              onChange={cambiar('email')}
            />
          </div>
          <div className="mb-6">
            <label className={etiquetaCampo} htmlFor="registro-password">Contraseña</label>
            <input
              id="registro-password"
              type="password"
              className={campoTexto}
              placeholder="Mínimo 6 caracteres"
              required
              minLength={6}
              autoComplete="new-password"
              value={datos.password}
              onChange={cambiar('password')}
            />
          </div>

          <button
            type="submit"
            className={boton('primario', 'w-full py-2.5')}
            disabled={enviando}
          >
            {enviando ? 'Registrando…' : 'Crear cuenta'}
          </button>
        </form>

        <p className="mt-4 text-center text-sm text-gray-500 dark:text-gray-400">
          ¿Ya tienes cuenta?{' '}
          <Link to="/login" className="font-semibold text-blue-600 hover:underline dark:text-blue-400">
            Inicia sesión
          </Link>
        </p>
      </div>
    </div>
  );
};
