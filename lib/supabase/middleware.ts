import { createServerClient } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';

export async function actualizarSesion(peticion: NextRequest) {
  let respuesta = NextResponse.next({ request: peticion });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
    {
      cookies: {
        getAll() {
          return peticion.cookies.getAll();
        },
        setAll(cookiesNuevas) {
          cookiesNuevas.forEach(({ name, value }) =>
            peticion.cookies.set(name, value)
          );
          respuesta = NextResponse.next({ request: peticion });
          cookiesNuevas.forEach(({ name, value, options }) =>
            respuesta.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  const {
    data: { user: usuario },
  } = await supabase.auth.getUser();

  if (!usuario && peticion.nextUrl.pathname.startsWith('/dashboard')) {
    const url = peticion.nextUrl.clone();
    url.pathname = '/login';
    return NextResponse.redirect(url);
  }

  return respuesta;
}