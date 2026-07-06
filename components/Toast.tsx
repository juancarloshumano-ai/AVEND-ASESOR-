'use client';

import { useEffect, useState } from 'react';

interface ToastProps {
  mensaje: string;
  tipo: 'exito' | 'error' | 'info';
  duracion?: number;
}

export function Toast({ mensaje, tipo, duracion = 3000 }: ToastProps) {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const temporizador = setTimeout(() => setVisible(false), duracion);
    return () => clearTimeout(temporizador);
  }, [duracion]);

  if (!visible) return null;

  const colores = {
    exito: 'bg-green-500',
    error: 'bg-red-500',
    info: 'bg-blue-500',
  };

  return (
    <div className={`fixed bottom-4 right-4 ${colores[tipo]} text-white px-6 py-3 rounded-lg shadow-lg`}>
      {mensaje}
    </div>
  );
}