import React, { useState } from 'react';
import { Routes, Route, Navigate, useLocation, useNavigate } from 'react-router-dom';
import { LayoutTienda } from './layout/LayoutTienda';
import { PanelAjustes } from './layout/PanelAjustes';
import { Home } from './pages/Home';
import { Categorias } from './pages/Categorias';
import { Ofertas } from './pages/Ofertas';
import { Carrito } from './pages/Carrito';
import { CompraExitosa } from './pages/CompraExitosa';
import { PagoResultado } from './pages/PagoResultado';
import { AdminDashboard } from './pages/AdminDashboard';
import { NoEncontrado } from './pages/NoEncontrado';
import { Login } from './pages/Login';
import { Registro } from './pages/Registro';
import { useAuth } from './context/AuthContext';
import { useCarrito } from './context/CarritoContext';
import { Link } from 'react-router-dom';

// protege la ruta /admin: exige sesion iniciada y rol admin
const RutaProtegidaAdmin = ({ children }) => {
  const { autenticado, esAdmin } = useAuth();
  const location = useLocation();

  if (!autenticado) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
  if (!esAdmin) {
    return (
      <div className="mx-auto my-10 max-w-lg px-4">
        <div className="rounded-2xl bg-white p-8 text-center shadow-sm ring-1 ring-black/5 dark:bg-gray-800 dark:ring-white/10">
          <p className="mb-2 text-3xl">🔒</p>
          <h2 className="mb-2 text-xl font-bold text-gray-900 dark:text-white">
            Acceso restringido
          </h2>
          <p className="mb-5 text-sm text-gray-500 dark:text-gray-400">
            Necesitas una cuenta con rol <strong>ADMIN</strong> para gestionar el inventario.
          </p>
          <Link
            to="/"
            className="inline-block rounded-lg bg-gray-900 px-4 py-2 text-sm font-semibold text-white hover:bg-gray-800 dark:bg-white dark:text-gray-900 dark:hover:bg-gray-200"
          >
            Volver a la tienda
          </Link>
        </div>
      </div>
    );
  }
  return children;
};

function App() {
  const [datosOrden, setDatosOrden] = useState(null);
  const [pagoExitoso, setPagoExitoso] = useState(true);
  const { carrito, vaciarCarrito, totalCarrito } = useCarrito();
  const navigate = useNavigate();

  const procesarPago = (cliente, simularExito = true) => {
    // el backend todavia no tiene endpoint de ordenes, asi que la compra
    // se genera en local mientras tanto
    const orden = {
      ordenId: String(Math.floor(Math.random() * 900000) + 100000),
      cliente,
      productos: [...carrito],
      total: totalCarrito,
    };

    setDatosOrden(orden);
    setPagoExitoso(simularExito);
    if (simularExito) {
      vaciarCarrito();
    }
    navigate('/checkout/resultado');
  };

  return (
    <>
      <PanelAjustes />
      <Routes>
        <Route element={<LayoutTienda />}>
          <Route path="/" element={<Home />} />
          <Route path="/categorias" element={<Categorias />} />
          <Route path="/ofertas" element={<Ofertas />} />
          <Route path="/carrito" element={<Carrito procesarPago={procesarPago} />} />
          <Route
            path="/checkout/resultado"
            element={
              !datosOrden ? (
                <Navigate to="/" replace />
              ) : pagoExitoso ? (
                <CompraExitosa ordenData={datosOrden} />
              ) : (
                <PagoResultado exito={false} datosOrden={datosOrden} />
              )
            }
          />
          <Route path="/login" element={<Login />} />
          <Route path="/registro" element={<Registro />} />
          <Route path="*" element={<NoEncontrado />} />
        </Route>
        <Route
          path="/admin"
          element={
            <RutaProtegidaAdmin>
              <AdminDashboard />
            </RutaProtegidaAdmin>
          }
        />
      </Routes>
    </>
  );
}

export default App;
