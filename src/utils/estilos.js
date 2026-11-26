// clases tailwind reutilizadas en botones, inputs y etiquetas

const baseBoton =
  'inline-flex items-center justify-center gap-2 rounded-lg px-4 py-2 text-sm font-semibold transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60';

export const boton = (variante = 'primario', extra = '') => {
  const variantes = {
    primario: 'bg-blue-600 text-white hover:bg-blue-700 focus-visible:ring-blue-500 dark:focus-visible:ring-offset-gray-900',
    oscuro: 'bg-gray-900 text-white hover:bg-gray-800 focus-visible:ring-gray-700 dark:bg-white dark:text-gray-900 dark:hover:bg-gray-200',
    exito: 'bg-emerald-600 text-white hover:bg-emerald-700 focus-visible:ring-emerald-500',
    advertencia: 'bg-amber-400 text-gray-900 hover:bg-amber-300 focus-visible:ring-amber-400',
    peligro: 'bg-red-600 text-white hover:bg-red-700 focus-visible:ring-red-500',
    secundario:
      'bg-gray-100 text-gray-700 hover:bg-gray-200 focus-visible:ring-gray-400 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600',
    bordeOscuro:
      'border border-gray-300 text-gray-700 hover:bg-gray-100 focus-visible:ring-gray-400 dark:border-gray-600 dark:text-gray-200 dark:hover:bg-gray-700/60',
    bordeClaro: 'border border-white/40 text-white hover:bg-white/10 focus-visible:ring-white',
    bordeAmarillo: 'border border-amber-400 text-amber-300 hover:bg-amber-400/10 focus-visible:ring-amber-400',
    bordeRojo:
      'border border-red-500 text-red-600 hover:bg-red-50 focus-visible:ring-red-400 dark:text-red-400 dark:hover:bg-red-950/40',
  };
  return `${baseBoton} ${variantes[variante] ?? variantes.primario} ${extra}`;
};

export const botonPequeno = (variante = 'primario', extra = '') =>
  boton(variante, `px-2.5 py-1 text-xs ${extra}`);

export const campoTexto =
  'w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 placeholder-gray-400 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-800 dark:text-white dark:placeholder-gray-500';

export const campoSoloLectura =
  'w-full cursor-default rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-sm text-gray-700 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-300';

export const etiquetaCampo =
  'mb-1 block text-xs font-medium text-gray-600 dark:text-gray-400';
