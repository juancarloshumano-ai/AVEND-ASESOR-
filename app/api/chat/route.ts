import { crearClienteServidor } from '@/lib/supabase/server';
import { crearClienteAdmin } from '@/lib/supabase/admin';
import { buscarDocumentosRelevantes } from '@/lib/servicios/busqueda';
import { Anthropic } from '@anthropic-ai/sdk';
import { NextResponse } from 'next/server';

export async function POST(peticion: Request) {
  try {
    const cuerpo = await peticion.json();
    const { pregunta } = cuerpo;

    if (!pregunta || !pregunta.trim()) {
      return NextResponse.json(
        { exito: false, error: { codigo: 'PREGUNTA_VACIA', mensaje: 'La pregunta no puede estar vacia' } },
        { status: 400 }
      );
    }

    const supabaseUsuario = await crearClienteServidor();
    const { data: datosUsuario, error: errorUsuario } = await supabaseUsuario.auth.getUser();

    if (errorUsuario || !datosUsuario.user) {
      return NextResponse.json(
        { exito: false, error: { codigo: 'NO_AUTENTICADO', mensaje: 'Usuario no autenticado' } },
        { status: 401 }
      );
    }

    const usuarioId = datosUsuario.user.id;

    const documentos = await buscarDocumentosRelevantes(pregunta);

    const contexto = documentos
      .map(
        (doc) =>
          `Documento: ${doc.titulo} (${doc.proceso})\n` +
          `Contenido: ${JSON.stringify(doc.contenido, null, 2)}`
      )
      .join('\n\n---\n\n');

    const promptSistema = `Eres un asistente especializado en la Carrera Publica Magisterial del Peru. 
Responde preguntas basandote UNICAMENTE en la normativa proporcionada.
Si la informacion no esta en los documentos, di que no encontraste informacion.
Se conciso y usa terminos simples.`;

    const promptUsuario = `Documentos:\n\n${contexto}\n\nPregunta: ${pregunta}`;

    const cliente = new Anthropic({
  apiKey: process.env.CLAUDE_API_KEY,
});
    const respuestaClause = await cliente.messages.create({
      model: 'claude-opus-4-6',
      max_tokens: 1000,
      system: promptSistema,
      messages: [
        {
          role: 'user',
          content: promptUsuario,
        },
      ],
    });

    const respuestaTexto =
      respuestaClause.content[0].type === 'text' ? respuestaClause.content[0].text : 'Sin respuesta';

    const supabaseAdmin = crearClienteAdmin();
    const { error: errorGuardar } = await supabaseAdmin.from('chats').insert({
      user_id: usuarioId,
      pregunta,
      respuesta: respuestaTexto,
      documentos_usados: documentos.map((doc) => ({ id: doc.id, titulo: doc.titulo })),
      tokens_entrada: respuestaClause.usage.input_tokens,
      tokens_salida: respuestaClause.usage.output_tokens,
      version_normativa: documentos[0]?.version || 'desconocida',
    });

    if (errorGuardar) {
      console.error('Error al guardar:', errorGuardar);
      return NextResponse.json(
        { exito: false, error: { codigo: 'ERROR_GUARDAR', mensaje: 'Error al guardar' } },
        { status: 500 }
      );
    }

    return NextResponse.json(
      {
        exito: true,
        datos: {
          respuesta: respuestaTexto,
          documentosUsados: documentos.map((doc) => doc.titulo),
        },
      },
      { status: 200 }
    );
  } catch (errorCapturado) {
    console.error('Error en chat:', errorCapturado);
    return NextResponse.json(
      {
        exito: false,
        error: {
          codigo: 'ERROR_SERVIDOR',
          mensaje: errorCapturado instanceof Error ? errorCapturado.message : 'Error desconocido',
        },
      },
      { status: 500 }
    );
  }
}