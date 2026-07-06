'use client';

import { useEffect, useState } from 'react';
import { crearClienteNavegador } from '@/lib/supabase/client';

interface Chat {
  id: string;
  pregunta: string;
  respuesta: string;
  created_at: string;
  tokens_entrada: number;
  tokens_salida: number;
}

export default function PaginaHistorial() {
  const [chats, setChats] = useState<Chat[]>([]);
  const [busqueda, setBusqueda] = useState('');
  const [cargando, setCargando] = useState(true);
  const [eliminando, setEliminando] = useState<string | null>(null);

  useEffect(() => {
    cargarChats();
  }, []);

  async function cargarChats() {
    try {
      const supabase = crearClienteNavegador();
      const { data } = await supabase.auth.getUser();

      if (!data.user) return;

      const { data: chatsData } = await supabase
        .from('chats')
        .select('*')
        .eq('user_id', data.user.id)
        .order('created_at', { ascending: false });

      setChats(chatsData || []);
    } catch (error) {
      console.error('Error cargando chats:', error);
    } finally {
      setCargando(false);
    }
  }
function exportarCSV() {
  if (!chatsFiltrados || chatsFiltrados.length === 0) {
    alert('No hay chats para descargar');
    return;
  }

  const csvContenido = [
    ['Fecha', 'Pregunta', 'Respuesta', 'Tokens Entrada', 'Tokens Salida'].join(','),
    ...chatsFiltrados.map((chat) =>
      [
        new Date(chat.created_at).toLocaleDateString('es-PE'),
        `"${chat.pregunta.replace(/"/g, '""')}"`,
        `"${chat.respuesta.replace(/"/g, '""')}"`,
        chat.tokens_entrada || 0,
        chat.tokens_salida || 0,
      ].join(',')
    ),
  ].join('\n');

  const blob = new Blob([csvContenido], { type: 'text/csv;charset=utf-8;' });
  const enlace = document.createElement('a');
  const url = URL.createObjectURL(blob);

  enlace.setAttribute('href', url);
  enlace.setAttribute('download', `historial-consultas-${new Date().toLocaleDateString('es-PE')}.csv`);
  enlace.style.visibility = 'hidden';

  document.body.appendChild(enlace);
  enlace.click();
  document.body.removeChild(enlace);
}
  async function eliminarChat(idChat: string) {
    setEliminando(idChat);
    try {
      const respuesta = await fetch(`/api/chats/${idChat}/delete`, {
        method: 'DELETE',
      });

      if (respuesta.ok) {
        setChats(chats.filter((chat) => chat.id !== idChat));
      }
    } catch (error) {
      console.error('Error eliminando:', error);
    } finally {
      setEliminando(null);
    }
  }

  const chatsFiltrados = chats.filter(
    (chat) =>
      chat.pregunta.toLowerCase().includes(busqueda.toLowerCase()) ||
      chat.respuesta.toLowerCase().includes(busqueda.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Historial de Consultas</h2>
        <p className="text-gray-600 mt-2">
          Revisa todas tus consultas anteriores
        </p>
      </div>

      <input
        type="text"
        placeholder="Buscar en historial..."
        value={busqueda}
        onChange={(e) => setBusqueda(e.target.value)}
        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
<button
        onClick={exportarCSV}
        disabled={!chatsFiltrados || chatsFiltrados.length === 0}
        className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        Descargar CSV
      </button>
      {cargando ? (
        <p className="text-center text-gray-600">Cargando...</p>
      ) : !chatsFiltrados || chatsFiltrados.length === 0 ? (
        <div className="rounded-lg border border-gray-200 bg-gray-50 p-6 text-center">
          <p className="text-gray-600">
            {chats.length === 0
              ? 'Aun no tienes consultas'
              : 'No hay resultados para tu busqueda'}
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {chatsFiltrados.map((chat) => (
            <div
              key={chat.id}
              className="rounded-lg border border-gray-200 bg-white p-4"
            >
              <div className="space-y-3">
                <div>
                  <p className="text-sm font-semibold text-gray-700">
                    Pregunta:
                  </p>
                  <p className="text-gray-900">{chat.pregunta}</p>
                </div>

                <div>
                  <p className="text-sm font-semibold text-gray-700">
                    Respuesta:
                  </p>
                  <p className="text-gray-800 text-sm line-clamp-3">
                    {chat.respuesta}
                  </p>
                </div>

                <div className="flex flex-wrap gap-4 text-xs text-gray-600">
                  <span>
                    {new Date(chat.created_at).toLocaleDateString('es-PE')}
                  </span>
                  <span>Tokens: {chat.tokens_entrada || 0}</span>
                </div>

                <button
                  onClick={() => eliminarChat(chat.id)}
                  disabled={eliminando === chat.id}
                  className="mt-2 px-3 py-1 bg-red-500 text-white rounded text-sm hover:bg-red-600 disabled:opacity-50"
                >
                  {eliminando === chat.id ? 'Eliminando...' : 'Eliminar'}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}