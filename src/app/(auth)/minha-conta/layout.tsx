import { ReactNode } from 'react';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import Link from 'next/link';

export const metadata = {
  title: 'Minha Conta - mimuus.',
  description: 'Acompanhe seus pedidos e gerencie sua conta.',
};

export default async function AccountLayout({ children }: { children: ReactNode }) {
  const cookieStore = await cookies();
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value;
        },
      },
    }
  );

  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login?next=/minha-conta');
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-950 pt-24 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row gap-8">
          
          <aside className="w-full lg:w-64 shrink-0">
            <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-white/5 top-24 lg:sticky">
              <div className="mb-8">
                <p className="text-sm text-gray-500">Olá,</p>
                <p className="font-bold truncate" title={user.email}>{user.email}</p>
              </div>
              
              <nav className="space-y-2">
                <Link
                  href="/minha-conta"
                  className="block px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-100 dark:hover:bg-white/5 transition-colors"
                >
                  Dashboard
                </Link>
                <Link
                  href="/minha-conta/pedidos"
                  className="block px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-100 dark:hover:bg-white/5 transition-colors"
                >
                  Meus Pedidos
                </Link>
              </nav>
            </div>
          </aside>

          <main className="flex-1 min-w-0">
            {children}
          </main>
          
        </div>
      </div>
    </div>
  );
}
