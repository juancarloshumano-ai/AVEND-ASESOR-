'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface Mensaje {
  id: string;
  tipo: 'pregunta' | 'respuesta';
  contenido: string;
  timestamp: Date;
}

export function ChatForm() {
  const [pregunta, setPregunta] = useState('');
  const [mensajes, setMensajes] = useState<Mensaje[]>([]);
  const [estaCargando, setEstaCargando] = useState(false);

  async function manejarEnvio(e: React.FormEvent) {
    e.preventDefault();
    
    if (!pregunta.trim()) return;

    setEstaCargando(true);

    const idPregunta = Date.now().toString();
    const nuevaMensajeUsuario: Mensaje = {
      id: idPregunta,
      tipo: 'pregunta',
      contenido: pregunta,
      timestamp: new Date(),
    };

    setMensajes((prev) => [...prev, nuevaMensajeUsuario]);
    setPregunta('');

    try {
      const respuesta = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ pregunta }),
      });

      const datos = await respuesta.json();

      if (!respuesta.ok) {
        const mensajeError: Mensaje = {
          id: `error-${Date.now()}`,
          tipo: 'respuesta',
          contenido: `Error: ${datos.error?.mensaje || 'No se pudo obtener respuesta'}`,
          timestamp: new Date(),
        };
        setMensajes((prev) => [...prev, mensajeError]);
        setEstaCargando(false);
        return;
      }

      const mensajeRespuesta: Mensaje = {
        id: `respuesta-${Date.now()}`,
        tipo: 'respuesta',
        contenido: datos.datos?.respuesta || 'Sin respuesta',
        timestamp: new Date(),
      };

      setMensajes((prev) => [...prev, mensajeRespuesta]);
    } catch (error) {
      const mensajeError: Mensaje = {
        id: `error-${Date.now()}`,
        tipo: 'respuesta',
        contenido: error instanceof Error ? error.message : 'Error de conexión',
        timestamp: new Date(),
      };
      setMensajes((prev) => [...prev, mensajeError]);
    }

    setEstaCargando(false);
  }

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Consulta sobre Normativa</h3>
      
      <div className="rounded-lg border border-gray-200 bg-white p-4 space-y-4">
        {mensajes.length === 0 ? (
          <p className="text-sm text-gray-500">
            Escribe una pregunta sobre la Carrera Pública Magisterial y recibirás orientación basada en normativa actual.
          </p>
        ) : (
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {mensajes.map((msg) => (
              <div
                key={msg.id}
                className={`p-3 rounded-lg ${
                  msg.tipo === 'pregunta'
                    ? 'bg-blue-50 border border-blue-200'
                    : 'bg-gray-50 border border-gray-200'
                }`}
              >
                <p className="text-xs font-semibold text-gray-600 mb-1">
                  {msg.tipo === 'pregunta' ? 'Tu pregunta:' : 'Respuesta:'}
                </p>
                <p className="text-sm text-gray-800">{msg.contenido}</p>
              </div>
            ))}
          </div>
        )}

        <form onSubmit={manejarEnvio} className="space-y-3">
          <div className="space-y-2">
            <Label htmlFor="pregunta">Tu pregunta</Label>
            <Input
              id="pregunta"
              placeholder="Ej: Cuales son los requisitos para ascenso?"
              value={pregunta}
              onChange={(e) => setPregunta(e.target.value)}
              disabled={estaCargando}
            />
          </div>
          <Button
            type="submit"
            className="w-full"
            disabled={estaCargando || !pregunta.trim()}
          >
            {estaCargando ? 'Buscando respuesta...' : 'Enviar'}
          </Button>
        </form>
      </div>
    </div>
  );
}