import { useCallback, useEffect, useState } from 'react';
import { obtenerProductos } from '../api/productosApi';

// carga los productos desde el backend y expone el estado de la carga
export const useProductos = () => {
  const [productos, setProductos] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);

  const cargar = useCallback(async () => {
    setCargando(true);
    setError(null);
    try {
      const data = await obtenerProductos();
      setProductos(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err.message ?? 'Error al cargar los productos');
    } finally {
      setCargando(false);
    }
  }, []);

  useEffect(() => {
    cargar();
  }, [cargar]);

  return { productos, cargando, error, recargar: cargar, setProductos };
};
