'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

const ESPECIALIDADES_PRIMARIA = [
  'Primaria (general)',
  'Educación Física',
  'Profesor de Innovación Pedagógica',
];

const ESPECIALIDADES_SECUNDARIA = [
  'Arte y Cultura',
  'Ciencia y Tecnología',
  'Ciencias Sociales',
  'Comunicación',
  'DPCC (Desarrollo Personal, Ciudadanía y Cívica)',
  'Educación Física',
  'Educación para el Trabajo (EPT)',
  'Educación Religiosa',
  'Inglés',
  'Matemática',
  'Profesor de Innovación Pedagógica',
];

export function RegisterForm() {
  const router = useRouter();
  
  const [email, setEmail] = useState('');
  const [contrasena, setContrasena] = useState('');
  const [modalidad, setModalidad] = useState<string | null>(null);
  const [nivel, setNivel] = useState<string | null>(null);
  const [especialidad, setEspecialidad] = useState<string | null>(null);
  
  const [estaCargando, setEstaCargando] = useState(false);
  const [mensajeError, setMensajeError] = useState('');
  const [mensajeExito, setMensajeExito] = useState('');

  const mostrarNivel = modalidad === 'EBR';
  const mostrarEspecialidad = nivel === 'Primaria' || nivel === 'Secundaria';
  const opcionesEspecialidad =
    nivel === 'Primaria' ? ESPECIALIDADES_PRIMARIA : ESPECIALIDADES_SECUNDARIA;

  async function manejarEnvio(e: React.FormEvent) {
    e.preventDefault();
    setMensajeError('');
    setMensajeExito('');

    if (!email || !contrasena || !modalidad) {
      setMensajeError('Por favor completa todos los campos requeridos');
      return;
    }

    if ((nivel === 'Primaria' || nivel === 'Secundaria') && !especialidad) {
      setMensajeError('Por favor selecciona una especialidad');
      return;
    }

    setEstaCargando(true);

    try {
      const respuesta = await fetch('/api/auth/registro', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          contrasena,
          modalidad,
          nivel: nivel || undefined,
          especialidad: especialidad || undefined,
        }),
      });

      const datos = await respuesta.json();

      if (!respuesta.ok) {
        setMensajeError(
          datos.error?.mensaje || 'Error al registrarse. Intenta de nuevo.'
        );
        setEstaCargando(false);
        return;
      }

      setMensajeExito('¡Registro exitoso! Redirigiendo...');
      setTimeout(() => {
        router.push('/dashboard');
      }, 1500);
    } catch (error) {
      setMensajeError(
        error instanceof Error ? error.message : 'Error de conexión'
      );
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
          minLength={8}
          placeholder="Mínimo 8 caracteres"
          value={contrasena}
          onChange={(e) => setContrasena(e.target.value)}
          required
          disabled={estaCargando}
        />
      </div>

      <div className="space-y-2">
        <Label>Modalidad</Label>
        <Select
          value={modalidad || ''}
          onValueChange={(v) => {
            setModalidad(v);
            setNivel(null);
            setEspecialidad(null);
          }}
          disabled={estaCargando}
        >
          <SelectTrigger>
            <SelectValue placeholder="Selecciona tu modalidad" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="EBR">EBR — Educación Básica Regular</SelectItem>
            <SelectItem value="EBA">EBA — Educación Básica Alternativa</SelectItem>
            <SelectItem value="EBE">EBE — Educación Básica Especial</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {mostrarNivel && (
        <div className="space-y-2">
          <Label>Nivel</Label>
          <Select
            value={nivel || ''}
            onValueChange={(v) => {
              setNivel(v);
              setEspecialidad(null);
            }}
            disabled={estaCargando}
          >
            <SelectTrigger>
              <SelectValue placeholder="Selecciona tu nivel" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Inicial">Inicial</SelectItem>
              <SelectItem value="Primaria">Primaria</SelectItem>
              <SelectItem value="Secundaria">Secundaria</SelectItem>
            </SelectContent>
          </Select>
        </div>
      )}

      {mostrarEspecialidad && (
        <div className="space-y-2">
          <Label>Especialidad</Label>
          <Select
            value={especialidad || ''}
            onValueChange={setEspecialidad}
            disabled={estaCargando}
          >
            <SelectTrigger>
              <SelectValue placeholder="Selecciona tu especialidad" />
            </SelectTrigger>
            <SelectContent>
              {opcionesEspecialidad.map((esp) => (
                <SelectItem key={esp} value={esp}>
                  {esp}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}

      <Button
        type="submit"
        className="w-full"
        disabled={estaCargando}
      >
        {estaCargando ? 'Registrando...' : 'Registrarme'}
      </Button>
    </form>
  );
}
