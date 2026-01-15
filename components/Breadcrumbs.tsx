'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export function Breadcrumbs() {
  const pathname = usePathname();
  const segments = pathname.split('/').filter(Boolean);
  const segmentLabels: Record<string, string> = {
    dashboard: 'Dashboard',
    admin: 'Admin',
    criar: 'Criar Aposta',
    perfil: 'Meu Perfil',
    configuracoes: 'Configurações',
    users: 'Usuários',
    markets: 'Mercados',
  };

  return (
    <nav className="text-sm text-slate-500 mb-4 md:mb-0">
      <ol className="flex items-center space-x-2">
        {segments.map((segment, index) => {
          const path = `/${segments.slice(0, index + 1).join('/')}`;
          const isLast = index === segments.length - 1;
          const label = segmentLabels[segment] || segment;

          return (
            <li key={path} className="flex items-center">
              {index > 0 && <span className="mx-2 text-slate-600">/</span>}
              {isLast ? (
                <span className="text-slate-300 font-medium capitalize">
                  {label}
                </span>
              ) : (
                <Link 
                  href={path}
                  className="hover:text-orange-400 transition-colors capitalize"
                >
                  {label}
                </Link>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
