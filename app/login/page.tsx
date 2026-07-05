import { LoginForm } from '@/components/Auth/LoginForm';

export default function PaginaLogin() {
  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <h1 className="mb-6 text-2xl font-semibold text-center">
          Inicia sesión en AVEND ASESOR
        </h1>
        <LoginForm />
      </div>
    </div>
  );
}