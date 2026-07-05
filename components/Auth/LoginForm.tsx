'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import Link from 'next/link';

export function LoginForm() {
  const router = useRouter();
  
  const [email, setEmail] = useState('');
  const [contrasena, setContrasena] = useState('');
  const [estaCargando, setEstaCargando] = useState(false);
  const [mensajeError, setMensajeError] = useState('');
  const [mensajeExito, setMensajeExito] = useState('');

  async function manejarEnvio(e: React.FormEvent) {
    e.preventDefault();
    setMensajeError('');
    setMensajeExito('');

    if (!email || !contrasena) {
      setMensajeError('Por favor completa todos los campos');
      return;
    }

    setEstaCargando(true);

    try {
      const respuesta = await fetch('/api/auth/iniciar-sesion', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, contrasena }),
      });

      const datos = await respuesta.json();

      if (!respuesta.ok) {
        setMensajeError(datos.error?.mensaje || 'Email o contraseña incorrectos');
        setEstaCargando(false);
        return;
      }

      setMensajeExito('¡Sesión iniciada! Redirigiendo...');
      setTimeout(() => {
        router.push('/dashboard');
      }, 1500);
    } catch (error) {
      setMensajeError(error instanceof Error ? error.message : 'Error de conexión');
      setEstaCargando(false);
    }
  }

  return (
    <form onSubmit={manejarEnvio} className="space-y-4">
      {mensajeError && (
        <div className="rounded-md bg-red-50 p-3 text-sm text-red-700">
          {mensajeError}
        </div>
      )}

      {mensajeExito && (
        <div className="rounded-md bg-green-50 p-3 text-sm text-green-700">
          {mensajeExito}
        </div>
      )}

      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          type="email"
          placeholder="docente@ejemplo.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          disabled={estaCargando}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="password">Contraseña</Label>
        <Input
          id="password"
          type="password"
          placeholder="Tu contraseña"
          value={contrasena}
          onChange={(e) => setContrasena(e.target.value)}
          required
          disabled={estaCargando}
        />
      </div>

      <Button type="submit" className="w-full" disabled={estaCargando}>
        {estaCargando ? 'Iniciando sesión...' : 'Iniciar sesión'}
      </Button>

      <p className="text-center text-sm text-gray-600">
        ¿No tienes cuenta?{' '}
        <Link href="/register" className="text-blue-600 hover:underline">
          Regístrate aquí
        </Link>
      </p>
    </form>
  );
}