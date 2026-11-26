import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';

const AjustesContext = createContext(null);
const AJUSTES_KEY = 'logistock_ajustes';

const ajustesPorDefecto = {
  modoOscuro: false,
  tamanoLetra: 'normal',
  notificaciones: true,
};

const tamanosLetra = {
  chico: '14px',
  normal: '16px',
  grande: '18px',
};

function leerAjustes() {
  try {
    const data = localStorage.getItem(AJUSTES_KEY);
    return data ? { ...ajustesPorDefecto, ...JSON.parse(data) } : ajustesPorDefecto;
  } catch {
    return ajustesPorDefecto;
  }
}

// los ajustes se aplican directo sobre el html para que el modo oscuro
// y el tamaño de letra afecten a toda la aplicacion de inmediato
function aplicarEnDocumento(ajustes) {
  const raiz = document.documentElement;
  raiz.classList.toggle('dark', ajustes.modoOscuro);
  raiz.style.fontSize = tamanosLetra[ajustes.tamanoLetra] ?? tamanosLetra.normal;
}

export const AjustesProvider = ({ children }) => {
  const [ajustes, setAjustes] = useState(leerAjustes);

  useEffect(() => {
    aplicarEnDocumento(ajustes);
    try {
      localStorage.setItem(AJUSTES_KEY, JSON.stringify(ajustes));
    } catch {
      // si no se puede guardar, seguimos igual con los ajustes en memoria
    }
  }, [ajustes]);

  const cambiarAjuste = useCallback((cambio) => {
    setAjustes((prev) => ({ ...prev, ...cambio }));
  }, []);

  const valor = useMemo(
    () => ({ ...ajustes, cambiarAjuste }),
    [ajustes, cambiarAjuste]
  );

  return <AjustesContext.Provider value={valor}>{children}</AjustesContext.Provider>;
};

export const useAjustes = () => {
  const contexto = useContext(AjustesContext);
  if (!contexto) {
    throw new Error('useAjustes debe usarse dentro de un AjustesProvider');
  }
  return contexto;
};
