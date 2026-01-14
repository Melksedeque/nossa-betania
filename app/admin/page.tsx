import { auth } from '@/auth';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import { UserList } from './UserList';

export default async function AdminPage() {
  const session = await auth();

  if (!session?.user || session.user.role !== 'ADMIN') {
    redirect('/dashboard');
  }

  const users = await prisma.user.findMany({
    orderBy: { name: 'asc' },
  });

  return (
    <div className="min-h-screen bg-slate-900 p-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-white">Painel Administrativo</h1>
          <Link href="/dashboard" className="text-orange-500 hover:text-orange-400">
            Voltar ao Jogo
          </Link>
        </div>

        <div className="grid gap-6">
          <div className="bg-slate-800/50 p-6 rounded-2xl border border-slate-700">
            <h2 className="text-xl font-bold text-white mb-4">Gerenciar Usuários</h2>
            <UserList users={users} currentUserId={session.user.id || ''} />
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-slate-800/50 p-6 rounded-2xl border border-slate-700">
            <h2 className="text-xl font-bold text-white mb-4">Configurações do Sistema</h2>
            <div className="space-y-4">
              <div className="p-4 bg-slate-900/50 rounded border border-slate-800 flex justify-between items-center">
                <span className="text-slate-300">Logotipo e Identidade Visual</span>
                <span className="text-xs bg-slate-700 text-slate-400 px-2 py-1 rounded">Em Breve</span>
              </div>
              <div className="p-4 bg-slate-900/50 rounded border border-slate-800 flex justify-between items-center">
                <span className="text-slate-300">Textos e Termos de Uso</span>
                <span className="text-xs bg-slate-700 text-slate-400 px-2 py-1 rounded">Em Breve</span>
              </div>
            </div>
          </div>

          <div className="bg-slate-800/50 p-6 rounded-2xl border border-slate-700">
            <h2 className="text-xl font-bold text-white mb-4">Financeiro</h2>
            <div className="p-4 bg-slate-900/50 rounded border border-slate-800 flex justify-between items-center">
              <span className="text-slate-300">Solicitações de Recarga Pendentes</span>
              <span className="text-xs bg-slate-700 text-slate-400 px-2 py-1 rounded">0 Pendentes</span>
            </div>
          </div>
          </div>
        </div>
      </div>
    </div>
  );
}
