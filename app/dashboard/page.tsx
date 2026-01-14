import { Card } from '@/components/Card';
import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';
import { redirect } from 'next/navigation';
import { Button } from '@/components/Button';
import Link from 'next/link';
import { MendigarButton } from '@/components/MendigarButton';
import { DashboardTabs } from '@/components/DashboardTabs';
import { LogoutButton } from '@/components/LogoutButton';

async function getOpenMarkets() {
  return await prisma.market.findMany({
    where: { status: 'OPEN' },
    include: { 
      options: true,
      creator: { select: { name: true } },
      comments: {
        include: { user: { select: { name: true } } },
        orderBy: { createdAt: 'desc' }
      }
    },
    orderBy: { createdAt: 'desc' },
  });
}

async function getMyMarkets(userId: string) {
  return await prisma.market.findMany({
    where: { creatorId: userId },
    include: { options: true },
    orderBy: { createdAt: 'desc' },
  });
}

async function getLeaderboard() {
  return await prisma.user.findMany({
    take: 5,
    orderBy: { balance: 'desc' },
    select: { id: true, name: true, balance: true, image: true },
  });
}

async function getUserBets(userId: string) {
  return await prisma.bet.findMany({
    where: { userId },
    include: {
      option: {
        include: {
          market: true,
        },
      },
    },
    orderBy: { createdAt: 'desc' },
  });
}

export default async function DashboardPage() {
  const session = await auth();

  if (!session?.user?.id) {
    redirect('/login');
  }

  const userBalance = session.user.balance;
  const markets = (await getOpenMarkets()).map(market => ({
    ...market,
    createdAt: market.createdAt.toISOString(),
    expiresAt: market.expiresAt ? market.expiresAt.toISOString() : null,
    comments: market.comments.map(comment => ({
      ...comment,
      createdAt: comment.createdAt.toISOString(),
    })),
  }));
  
  const myMarkets = (await getMyMarkets(session.user.id)).map(market => ({
    ...market,
    createdAt: market.createdAt.toISOString(),
    expiresAt: market.expiresAt ? market.expiresAt.toISOString() : null,
  }));

  const userBets = (await getUserBets(session.user.id)).map(bet => ({
    ...bet,
    createdAt: bet.createdAt.toISOString(),
    option: {
      ...bet.option,
      market: {
        ...bet.option.market,
        createdAt: bet.option.market.createdAt.toISOString(),
        expiresAt: bet.option.market.expiresAt
          ? bet.option.market.expiresAt.toISOString()
          : null,
      },
    },
  }));

  const leaderboard = await getLeaderboard();

  return (
    <div className="min-h-screen bg-slate-900 p-6">
      <div className="max-w-6xl mx-auto space-y-8">
        
        {/* Header de Boas-vindas e Saldo */}
        <div className="flex flex-col md:flex-row justify-between items-center bg-slate-800/50 p-6 rounded-2xl border border-slate-700">
          <div className="w-full md:w-auto flex flex-col gap-2">
            <div className="flex items-center justify-between gap-4">
              <div>
                <h1 className="text-3xl font-bold text-white mb-1">
                  Olá, <span className="text-orange-500">{session.user.name}</span>! 👋
                </h1>
                <p className="text-slate-400 text-sm">Pronto para perder dinheiro hoje?</p>
              </div>
              <div className="flex items-center gap-4">
                <Link
                  href="/dashboard/perfil"
                  className="text-sm text-slate-300 hover:text-orange-400 underline-offset-4 hover:underline"
                >
                  Meu Perfil
                </Link>
                <LogoutButton />
              </div>
            </div>
          </div>
          <div className="mt-4 md:mt-0 text-right">
            <p className="text-sm text-slate-400 uppercase tracking-wider">Seu Saldo</p>
            <div className="text-4xl font-black text-green-400">
              A$ {userBalance.toFixed(2)}
            </div>
            {userBalance < 10 && (
              <MendigarButton userId={session.user.id} />
            )}
          </div>
        </div>
        
        {/* Conteúdo Principal com Abas */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          <div className="lg:col-span-2 space-y-6">
            <div className="flex justify-end">
              <Link href="/dashboard/criar">
                <Button size="sm" variant="outline" className="border-orange-500 text-orange-500 hover:bg-orange-500 hover:text-white">
                  + Criar Aposta
                </Button>
              </Link>
            </div>

            <DashboardTabs 
              openMarkets={markets} 
              myMarkets={myMarkets} 
              bets={userBets}
              user={{ 
                id: session.user.id, 
                balance: userBalance, 
                name: session.user.name || 'Anônimo' 
              }} 
            />
          </div>

          {/* Sidebar: Ranking */}
          <div className="space-y-6">
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              🌽 Top Milho-nários
            </h2>
            <Card className="p-0 overflow-hidden border-slate-800 bg-slate-900/50">
              {leaderboard.map((user, index) => (
                <div 
                  key={user.id} 
                  className={`flex items-center justify-between p-4 border-b border-slate-800 last:border-0 ${index === 0 ? 'bg-yellow-500/10' : ''}`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`
                      w-8 h-8 flex items-center justify-center rounded-full font-bold text-sm
                      ${index === 0 ? 'bg-yellow-500 text-black' : 
                        index === 1 ? 'bg-slate-400 text-black' : 
                        index === 2 ? 'bg-orange-700 text-white' : 'bg-slate-800 text-slate-500'}
                    `}>
                      {index + 1}
                    </div>
                    <span className={`font-medium ${index === 0 ? 'text-yellow-500' : 'text-slate-300'}`}>
                      {user.name || 'Anônimo'}
                    </span>
                  </div>
                  <span className="text-green-400 font-mono font-bold">
                    A$ {user.balance.toFixed(0)}
                  </span>
                </div>
              ))}
            </Card>
          </div>

        </div>
      </div>
    </div>
  );
}
