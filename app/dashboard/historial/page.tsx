import { crearClienteServidor } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import Link from 'next/link';

export default async function PaginaPerfil() {
  const supabase = await crearClienteServidor();

  const { data: datosUsuario } = await supabase.auth.getUser();
  if (!datosUsuario.user) {
    redirect('/login');
  }

  const { data: perfil } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', datosUsuario.user.id)
    .single();

  const { count: totalChats } = await supabase
    .from('chats')
    .select('*', { count: 'exact' })
    .eq('user_id', datosUsuario.user.id);

  return (
    <div className="space-y-6">
      <Link
        href="/dashboard"
        className="inline-block px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600"
      >
        Volver al Dashboard
      </Link>

      <div>
        <h2 className="text-2xl font-bold">Mi Perfil</h2>
        <p className="text-gray-600 mt-2">
          Informacion sobre tu cuenta y sesion
        </p>
      </div>

      <div className="rounded-lg border border-gray-200 bg-white p-6 space-y-4">
        <div>
          <p className="text-sm font-semibold text-gray-700">Email:</p>
          <p className="text-gray-900">{datosUsuario.user.email}</p>
        </div>

        <div>
          <p className="text-sm font-semibold text-gray-700">Modalidad:</p>
          <p className="text-gray-900">{perfil?.modalidad || '-'}</p>
        </div>

        <div>
          <p className="text-sm font-semibold text-gray-700">Nivel:</p>
          <p className="text-gray-900">{perfil?.nivel || '-'}</p>
        </div>

        <div>
          <p className="text-sm font-semibold text-gray-700">Especialidad:</p>
          <p className="text-gray-900">{perfil?.especialidad || '-'}</p>
        </div>

        <div>
          <p className="text-sm font-semibold text-gray-700">Total de Consultas:</p>
          <p className="text-gray-900">{totalChats || 0}</p>
        </div>

        <div className="pt-4">
          <p className="text-sm font-semibold text-gray-700">Miembro desde:</p>
          <p className="text-gray-900">
            {perfil?.created_at
              ? new Date(perfil.created_at).toLocaleDateString('es-PE')
              : '-'}
          </p>
        </div>
      </div>
    </div>
  );
}