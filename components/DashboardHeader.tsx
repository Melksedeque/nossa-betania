'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Logo } from '@/components/Logo';
import { LogoutButton } from '@/components/LogoutButton';
import { ProfileModal } from '@/components/ProfileModal';
import Image from 'next/image';

interface DashboardHeaderProps {
  user: {
    id: string;
    name: string | null;
    email: string | null;
    image: string | null;
    role: string;
    balance: number;
  };
  logoUrl?: string | null;
}

export function DashboardHeader({ user, logoUrl }: DashboardHeaderProps) {
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);

  return (
    <>
      <header className="border-b border-slate-800 bg-slate-950/70 backdrop-blur-sm sticky top-0 z-40">
        <div className="max-w-7xl mx-auto flex items-center justify-between px-4 sm:px-6 py-4 gap-4">
          <div className="flex items-center gap-8">
            <Logo className="shrink-0" logoUrl={logoUrl} />
            <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
              {user.role === 'ADMIN' ? (
                <>
                  <Link href="/admin/dashboard" className="text-slate-300 hover:text-white transition-colors">
                    Dashboard
                  </Link>
                  <Link href="/dashboard/criar" className="text-slate-300 hover:text-white transition-colors">
                    Criar Aposta
                  </Link>
                  <Link href="/admin/configuracoes" className="text-slate-300 hover:text-white transition-colors">
                    Configurações
                  </Link>
                </>
              ) : (
                <>
                  <Link href="/dashboard" className="text-slate-300 hover:text-white transition-colors">
                    Dashboard
                  </Link>
                  <Link href="/dashboard/criar" className="text-slate-300 hover:text-white transition-colors">
                    Criar Aposta
                  </Link>
                </>
              )}
            </nav>
          </div>

          <div className="flex items-center gap-4">
             <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-slate-900 rounded-full border border-slate-800" title="Seu Saldo">
                <span className="text-xs text-slate-400">Saldo:</span>
                <span className="text-sm font-bold text-green-400">A$ {user.balance.toFixed(2)}</span>
            </div>

            <button
              onClick={() => setIsProfileModalOpen(true)}
              className="flex items-center gap-3 hover:bg-slate-900 rounded-full pl-2 pr-4 py-1.5 transition-colors group border border-transparent hover:border-slate-800"
            >
              {user.image ? (
                 <Image src={user.image} alt={user.name || 'User'} className="w-8 h-8 rounded-full object-cover border border-slate-700 group-hover:border-slate-500" />
              ) : (
                <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center text-slate-400 group-hover:text-white group-hover:bg-slate-700 transition-colors border border-slate-700">
                    <span className="text-sm font-bold">{user.name?.[0]?.toUpperCase() || 'U'}</span>
                </div>
              )}
              <div className="text-left hidden sm:block">
                 <p className="text-xs font-medium text-white group-hover:text-orange-400 transition-colors max-w-[100px] truncate">{user.name}</p>
                 <p className="text-[10px] text-slate-500 truncate max-w-[100px]">{user.email}</p>
              </div>
            </button>
             <div className="h-6 w-px bg-slate-800 mx-1"></div>
             <LogoutButton />
          </div>
        </div>
      </header>

      <ProfileModal
        isOpen={isProfileModalOpen}
        onClose={() => setIsProfileModalOpen(false)}
        user={user}
      />
    </>
  );
}
