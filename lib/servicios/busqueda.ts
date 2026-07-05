import { crearClienteAdmin } from '@/lib/supabase/admin';

export async function buscarDocumentosRelevantes(pregunta: string) {
  try {
    const supabase = crearClienteAdmin();

    const palabrasClave = pregunta
      .toLowerCase()
      .split(' ')
      .filter((word) => word.length > 3);

    const { data, error } = await supabase
      .from('normativa_documentos')
      .select('id, proceso, titulo, contenido, version')
      .eq('estado', 'VIGENTE')
      .limit(3);

    if (error) {
      console.error('Error en busqueda:', error);
      return [];
    }

    if (!data) return [];

    const documentosFiltrados = data.filter((doc) => {
      const textoCompleto = `${doc.titulo} ${JSON.stringify(doc.contenido)}`.toLowerCase();
      return palabrasClave.some((palabra) => textoCompleto.includes(palabra));
    });

    return documentosFiltrados.length > 0 ? documentosFiltrados : data.slice(0, 2);
  } catch (error) {
    console.error('Error en busqueda de documentos:', error);
    return [];
  }
}