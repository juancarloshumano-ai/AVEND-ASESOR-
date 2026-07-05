'use client';

import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { crearClienteNavegador } from '@/lib/supabase/client';

export function LogoutButton() {
  const router = useRouter();

  async function manejarLogout() {
    const supabase = crearClienteNavegador();
    await supabase.auth.signOut();
    router.push('/login');
  }

  return (
    <Button onClick={manejarLogout} variant="outline">
      Cerrar sesión
    </Button>
  );
}
