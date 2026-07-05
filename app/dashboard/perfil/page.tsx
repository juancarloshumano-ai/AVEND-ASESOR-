'use client';

export default function PaginaPerfil() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Mi Perfil</h2>
        <p className="text-gray-600 mt-2">
          Informacion sobre tu cuenta
        </p>
      </div>

      <div className="rounded-lg border border-gray-200 bg-white p-6 space-y-4">
        <div>
          <p className="text-sm font-semibold text-gray-700">Estado:</p>
          <p className="text-gray-900">Sesion activa</p>
        </div>
      </div>
    </div>
  );
}