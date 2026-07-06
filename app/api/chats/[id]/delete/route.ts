import { crearClienteServidor } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

export async function DELETE(
  peticion: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  try {
    const supabase = await crearClienteServidor();

    const { data: datosUsuario } = await supabase.auth.getUser();
    if (!datosUsuario.user) {
      return NextResponse.json(
        { exito: false, error: 'No autenticado' },
        { status: 401 }
      );
    }

    const { error } = await supabase
      .from('chats')
      .delete()
      .eq('id', id)
      .eq('user_id', datosUsuario.user.id);

    if (error) {
      return NextResponse.json(
        { exito: false, error: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({ exito: true }, { status: 200 });
  } catch (errorCapturado) {
    return NextResponse.json(
      {
        exito: false,
        error: errorCapturado instanceof Error ? errorCapturado.message : 'Error desconocido',
      },
      { status: 500 }
    );
  }
}