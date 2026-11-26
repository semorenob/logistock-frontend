import { createContext, useCallback, useContext, useMemo, useState } from 'react';

const CarritoContext = createContext(null);

export const CarritoProvider = ({ children }) => {
  const [carrito, setCarrito] = useState([]);

  // no deja agregar mas unidades de las que hay en stock
  const agregarAlCarrito = useCallback((producto) => {
    setCarrito((prev) => {
      const existe = prev.find((item) => item.id === producto.id);
      if (existe) {
        if (existe.cantidad + 1 > (producto.stock ?? 0)) return prev;
        return prev.map((item) =>
          item.id === producto.id ? { ...item, cantidad: item.cantidad + 1 } : item
        );
      }
      if ((producto.stock ?? 0) < 1) return prev;
      return [...prev, { ...producto, cantidad: 1 }];
    });
  }, []);

  const cambiarCantidad = useCallback((id, cantidad) => {
    setCarrito((prev) =>
      prev.map((item) =>
        item.id === id
          ? { ...item, cantidad: Math.max(1, Math.min(cantidad, item.stock ?? cantidad)) }
          : item
      )
    );
  }, []);

  const eliminarDelCarrito = useCallback((id) => {
    setCarrito((prev) => prev.filter((item) => item.id !== id));
  }, []);

  const vaciarCarrito = useCallback(() => setCarrito([]), []);

  const valor = useMemo(() => {
    const totalCarrito = carrito.reduce((acc, item) => acc + item.precio * item.cantidad, 0);
    const cantidadItems = carrito.reduce((acc, item) => acc + item.cantidad, 0);
    return {
      carrito,
      agregarAlCarrito,
      cambiarCantidad,
      eliminarDelCarrito,
      vaciarCarrito,
      totalCarrito,
      cantidadItems,
    };
  }, [carrito, agregarAlCarrito, cambiarCantidad, eliminarDelCarrito, vaciarCarrito]);

  return <CarritoContext.Provider value={valor}>{children}</CarritoContext.Provider>;
};

export const useCarrito = () => {
  const contexto = useContext(CarritoContext);
  if (!contexto) {
    throw new Error('useCarrito debe usarse dentro de un CarritoProvider');
  }
  return contexto;
};
