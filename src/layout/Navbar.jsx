import React from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCarrito } from '../context/CarritoContext';
import { clp } from '../utils/formato';
import { boton } from '../utils/estilos';

const claseNavLink = ({ isActive }, clasesActivo, clasesInactivo) =>
  isActive ? clasesActivo : clasesInactivo;

export const Navbar = () => {
  const { usuario, autenticado, esAdmin, logout } = useAuth();
  const { totalCarrito, cantidadItems } = useCarrito();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="mb-4 bg-gray-900 px-4 py-3 text-white shadow-lg dark:bg-black">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3">
        <Link to="/" className="text-xl font-bold text-white">
          📦 LogiStock
          <small className="block text-[0.65rem] font-normal text-white/50">
            Retail &amp; Tecnología
          </small>
        </Link>

        <div className="flex flex-wrap items-center justify-end gap-2">
          <NavLink
            to="/"
            end
            className={(estado) =>
              claseNavLink(estado, boton('primario'), boton('bordeClaro', 'border-white/30'))
            }
          >
            Inicio
          </NavLink>
          <NavLink
            to="/categorias"
            className={(estado) =>
              claseNavLink(estado, boton('primario'), boton('bordeClaro', 'border-white/30'))
            }
          >
            Catálogo
          </NavLink>
          <NavLink
            to="/ofertas"
            className={(estado) =>
              claseNavLink(estado, boton('advertencia'), boton('bordeAmarillo'))
            }
          >
            Ofertas 🔥
          </NavLink>

          {/* el acceso al panel solo aparece para administradores con sesion iniciada */}
          {esAdmin && (
            <NavLink
              to="/admin"
              className={(estado) =>
                claseNavLink(
                  estado,
                  boton('advertencia'),
                  boton('bordeClaro', 'border-sky-400/60 text-sky-300')
                )
              }
            >
              Panel admin
            </NavLink>
          )}

          <NavLink
            to="/carrito"
            className={(estado) =>
              claseNavLink(
                estado,
                boton('exito'),
                boton('bordeClaro', 'border-emerald-400/60 text-emerald-300')
              )
            }
          >
            🛒 Carrito ({cantidadItems}) - ${clp(totalCarrito)}
          </NavLink>

          {autenticado ? (
            <div className="flex items-center gap-2">
              <span className="hidden text-xs text-white/70 sm:inline" data-testid="usuario-navbar">
                {usuario.nombre}{' '}
                <span
                  className={`ml-1 rounded-full px-2 py-0.5 text-[0.65rem] font-bold ${
                    esAdmin ? 'bg-red-500/80 text-white' : 'bg-white/15 text-white/80'
                  }`}
                >
                  {usuario.rol}
                </span>
              </span>
              <button type="button" className={boton('secundario')} onClick={handleLogout}>
                Cerrar sesión
              </button>
            </div>
          ) : (
            <>
              <NavLink
                to="/login"
                className={(estado) =>
                  claseNavLink(estado, boton('secundario'), boton('bordeClaro', 'border-white/30'))
                }
              >
                Iniciar sesión
              </NavLink>
              <NavLink
                to="/registro"
                className={(estado) =>
                  claseNavLink(estado, boton('advertencia'), boton('bordeAmarillo'))
                }
              >
                Crear cuenta
              </NavLink>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};
