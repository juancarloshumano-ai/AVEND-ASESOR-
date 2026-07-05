import { crearClienteServidor } from '@/lib/supabase/server';
import { esquemaInicioSesion } from '@/lib/validaciones/auth';
import { NextResponse } from 'next/server';

export async function POST(peticion: Request) {
  const cuerpo = await peticion.json();
  const resultado = esquemaInicioSesion.safeParse(cuerpo);

  if (!resultado.success) {
    return NextResponse.json(
      {
        exito: false,
        error: { codigo: 'ERROR_VALIDACION', mensaje: resultado.error.issues[0].message },
        fecha: new Date().toISOString(),
      },
      { status: 400 }
    );
  }

  const supabase = await crearClienteServidor();
  const { data: datosUsuario, error: errorInicioSesion } = await supabase.auth.signInWithPassword({
    email: resultado.data.email,
    password: resultado.data.contrasena,
  });

  if (errorInicioSesion) {
    return NextResponse.json(
      {
        exito: false,
        error: { codigo: 'FALLO_AUTENTICACION', mensaje: 'Email o contraseña incorrectos' },
        fecha: new Date().toISOString(),
      },
      { status: 401 }
    );
  }

  return NextResponse.json(
    {
      exito: true,
      datos: { id: datosUsuario.user.id, email: datosUsuario.user.email },
      fecha: new Date().toISOString(),
    },
    { status: 200 }
  );
}