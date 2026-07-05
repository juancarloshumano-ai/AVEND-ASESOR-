import { ChatForm } from '@/components/Chat/ChatForm';

export default function PaginaDashboard() {
  return (
    <div className="space-y-8">
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Bienvenido a AVEND ASESOR</h2>
        <p className="text-gray-600">
          Este es tu panel principal. Aquí podrás hacer consultas sobre la Carrera Pública Magisterial.
        </p>
        <div className="rounded-lg border border-gray-200 bg-white p-6">
          <h3 className="mb-2 font-semibold">Información de tu cuenta</h3>
          <p className="text-sm text-gray-600">Tu sesión está activa y segura.</p>
        </div>
      </div>

      <ChatForm />
    </div>
  );
}