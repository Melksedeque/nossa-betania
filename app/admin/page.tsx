import { auth } from '@/auth';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import { UserList } from './UserList';
import { MarketListAdmin } from './MarketList';

export default async function AdminPage() {
  const session = await auth();

  if (!session?.user || session.user.role !== 'ADMIN') {
    redirect('/dashboard');
  }

  // Métricas do Dashboard
  const totalUsers = await prisma.user.count({
    where: { role: 'USER' },
  });

  const totalMarkets = await prisma.market.count();
  
  const totalBets = await prisma.bet.count();

  const moneyStats = await prisma.user.aggregate({
    _sum: { balance: true },
  });

  const betsStats = await prisma.bet.aggregate({
    _sum: { amount: true },
  });
  
  const pendingBetsStats = await prisma.bet.aggregate({
    where: { status: 'PENDING' },
    _sum: { amount: true },
  });

  // Dados para as listas
  const users = await prisma.user.findMany({
    orderBy: { name: 'asc' },
  });

  const markets = await prisma.market.findMany({
    include: {
      creator: {
        select: { name: true, email: true },
      },
      _count: {
        select: { options: true, comments: true },
      },
    },
    orderBy: { createdAt: 'desc' },
  });

  return (
    <div className="min-h-screen bg-slate-900 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-white">Painel Administrativo</h1>
          <div className="flex gap-4 items-center">
            <Link 
              href="/admin/configuracoes" 
              className="px-4 py-2 rounded-lg bg-slate-800 text-slate-200 hover:bg-slate-700 hover:text-white transition-colors border border-slate-700"
            >
              Configurações
            </Link>
            <Link href="/dashboard" className="text-orange-500 hover:text-orange-400 font-medium">
              Voltar ao Jogo
            </Link>
          </div>
        </div>

        {/* Dashboard de Métricas */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Card Jogadores */}
          <div className="bg-slate-800/50 p-6 rounded-2xl border border-slate-700">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-medium text-slate-400">Jogadores Ativos</h3>
              <span className="p-2 bg-blue-500/10 rounded-lg text-blue-500">
                👥
              </span>
            </div>
            <div className="text-2xl font-bold text-white">{totalUsers}</div>
            <p className="text-xs text-slate-500 mt-1">Usuários registrados</p>
          </div>

          {/* Card Apostas */}
          <div className="bg-slate-800/50 p-6 rounded-2xl border border-slate-700">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-medium text-slate-400">Total de Apostas</h3>
              <span className="p-2 bg-purple-500/10 rounded-lg text-purple-500">
                🎟️
              </span>
            </div>
            <div className="text-2xl font-bold text-white">{totalBets}</div>
            <p className="text-xs text-slate-500 mt-1">Em {totalMarkets} mercados</p>
          </div>

          {/* Card Financeiro - Circulação */}
          <div className="bg-slate-800/50 p-6 rounded-2xl border border-slate-700">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-medium text-slate-400">Em Circulação</h3>
              <span className="p-2 bg-green-500/10 rounded-lg text-green-500">
                💰
              </span>
            </div>
            <div className="text-2xl font-bold text-white">
              R$ {moneyStats._sum.balance?.toFixed(2) || '0.00'}
            </div>
            <p className="text-xs text-slate-500 mt-1">Saldo total nas carteiras</p>
          </div>

           {/* Card Financeiro - Volume */}
           <div className="bg-slate-800/50 p-6 rounded-2xl border border-slate-700">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-medium text-slate-400">Volume Apostado</h3>
              <span className="p-2 bg-orange-500/10 rounded-lg text-orange-500">
                📈
              </span>
            </div>
            <div className="text-2xl font-bold text-white">
              R$ {betsStats._sum.amount?.toFixed(2) || '0.00'}
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Sendo R$ {pendingBetsStats._sum.amount?.toFixed(2) || '0.00'} em aberto
            </p>
          </div>
        </div>

        {/* Áreas de Gerenciamento */}
        <div className="grid gap-8">
          {/* Seção de Mercados */}
          <section>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-white">Gerenciar Mercados</h2>
            </div>
            <div className="bg-slate-800/50 p-6 rounded-2xl border border-slate-700">
              <MarketListAdmin
                markets={markets.map((m) => ({
                  id: m.id,
                  question: m.question,
                  description: m.description,
                  status: m.status,
                  createdAt: m.createdAt.toISOString(),
                  creator: m.creator,
                  _count: m._count,
                }))}
              />
            </div>
          </section>

          {/* Seção de Usuários */}
          <section>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-white">Gerenciar Usuários</h2>
            </div>
            <div className="bg-slate-800/50 p-6 rounded-2xl border border-slate-700">
              <UserList users={users} currentUserId={session.user.id || ''} />
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
