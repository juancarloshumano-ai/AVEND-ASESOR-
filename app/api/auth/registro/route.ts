import { crearClienteServidor } from '@/lib/supabase/server';
import { esquemaRegistro } from '@/lib/validaciones/auth';
import { NextResponse } from 'next/server';

export async function POST(peticion: Request) {
  try {
    const cuerpo = await peticion.json();
    console.log('Datos recibidos:', cuerpo);

    const resultado = esquemaRegistro.safeParse(cuerpo);
    console.log('Validación:', resultado);

    if (!resultado.success) {
      console.log('Errores de validación:', resultado.error.issues);
      return NextResponse.json(
        {
          exito: false,
          error: { 
            codigo: 'ERROR_VALIDACION', 
            mensaje: resultado.error.issues[0].message,
            detalles: resultado.error.issues,
          },
        },
        { status: 400 }
      );
    }

    const { email, contrasena, modalidad, nivel, especialidad } = resultado.data;
    const supabase = await crearClienteServidor();

    const { data: datosUsuario, error: errorRegistro } = await supabase.auth.signUp({
      email,
      password: contrasena,
      options: {
        data: {
          modalidad,
          nivel,
          especialidad,
        },
      },
    });

    if (errorRegistro) {
      console.log('Error Supabase:', errorRegistro);
      return NextResponse.json(
        {
          exito: false,
          error: { codigo: 'FALLO_AUTENTICACION', mensaje: errorRegistro.message },
        },
        { status: 400 }
      );
    }

    return NextResponse.json(
      {
        exito: true,
        datos: { id: datosUsuario.user?.id, email: datosUsuario.user?.email },
      },
      { status: 201 }
    );
  } catch (errorCapturado) {
    console.log('Error no manejado:', errorCapturado);
    return NextResponse.json(
      {
        exito: false,
        error: { 
          codigo: 'ERROR_SERVIDOR', 
          mensaje: errorCapturado instanceof Error ? errorCapturado.message : 'Error desconocido'
        },
      },
      { status: 500 }
    );
  }
}