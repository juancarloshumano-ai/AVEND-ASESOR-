import { crearClienteAdmin } from '@/lib/supabase/admin';
import { NextResponse } from 'next/server';

export async function POST() {
  try {
    const supabase = crearClienteAdmin();

    const documentosPrueba = [
      {
        proceso: 'ascenso',
        anio: 2024,
        titulo: 'Reglamento de Ascenso en la Carrera Publica Magisterial 2024',
        contenido: {
          resumen: 'Normas para ascender de una escala a otra en la CPM',
          requisitos: ['Ser docente nombrado', 'Haber permanecido minimo 2 anos'],
          plazos: 'Inscripcion de enero a febrero',
          puntaje_minimo: 60
        },
        estado: 'VIGENTE',
        version: '2024-v1',
        tags: ['ascenso', 'carrera'],
        fecha_publicacion: new Date('2024-01-15'),
      },
      {
        proceso: 'nombramiento',
        anio: 2024,
        titulo: 'Convocatoria para Nombramiento en la CPM 2024',
        contenido: {
          resumen: 'Proceso para obtener nombramiento docente',
          requisitos: ['Titulo profesional en educacion'],
          puntaje_minimo: 70
        },
        estado: 'VIGENTE',
        version: '2024-v1',
        tags: ['nombramiento'],
        fecha_publicacion: new Date('2024-02-01'),
      },
    ];

    const { data, error } = await supabase
      .from('normativa_documentos')
      .insert(documentosPrueba);

    if (error) {
      return NextResponse.json(
        { exito: false, error: { codigo: 'ERROR_BD', mensaje: error.message } },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { exito: true, mensaje: `Se cargaron ${documentosPrueba.length} documentos`, datos: data },
      { status: 201 }
    );
  } catch (errorCapturado) {
    return NextResponse.json(
      { exito: false, error: { codigo: 'ERROR_SERVIDOR', mensaje: errorCapturado instanceof Error ? errorCapturado.message : 'Error desconocido' } },
      { status: 500 }
    );
  }
}