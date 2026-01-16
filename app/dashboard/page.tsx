import { Card } from '@/components/Card';
import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';
import { redirect } from 'next/navigation';
import { MendigarButton } from '@/components/MendigarButton';
import { DashboardTabs } from '@/components/DashboardTabs';
import { CreateMarketRequestModalTrigger } from '@/components/CreateMarketRequestModal';

async function getOpenMarkets() {
  return await prisma.market.findMany({
    where: { status: 'OPEN', deletedAt: null },
    include: { 
      options: true,
      creator: { select: { name: true } },
      comments: {
        where: { deletedAt: null },
        include: { user: { select: { name: true } } },
        orderBy: { createdAt: 'desc' }
      }
    },
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
  const bets = await prisma.bet.findMany({
    where: { userId, deletedAt: null },
    include: {
      option: {
        include: {
          market: true,
        },
      },
    },
    orderBy: { createdAt: 'desc' },
  });

  return bets.filter(bet => !bet.option.market.deletedAt);
}

export default async function DashboardPage() {
  const session = await auth();

  if (!session?.user?.id) {
    redirect('/login');
  }

  const userBalance = session.user.balance ?? 0;
  const marketsRaw = await getOpenMarkets();

  const markets = marketsRaw.map(market => ({
    ...market,
    createdAt: market.createdAt.toISOString(),
    expiresAt: market.expiresAt ? market.expiresAt.toISOString() : null,
    comments: market.comments.map(comment => ({
      ...comment,
      createdAt: comment.createdAt.toISOString(),
    })),
  }));
  
  const betsRaw = await getUserBets(session.user.id);
  const openBetStatuses = ['PENDING'];

  const openBetsRaw = betsRaw.filter(bet => openBetStatuses.includes(bet.status));
  const historyBetsRaw = betsRaw.filter(bet => !openBetStatuses.includes(bet.status));

  const mapBet = (bet: {
    id: string;
    amount: number;
    status: string;
    createdAt: Date;
    option: {
      label: string;
      odds: number;
      market: {
        id: string;
        question: string;
        status: string;
        createdAt: Date;
      };
    };
  }) => ({
    ...bet,
    createdAt: bet.createdAt.toISOString(),
    option: {
      ...bet.option,
      market: {
        ...bet.option.market,
        createdAt: bet.option.market.createdAt.toISOString(),
      },
    },
  });

  const myBets = openBetsRaw.map(mapBet);
  const history = historyBetsRaw.map(mapBet);

  const leaderboard = await getLeaderboard();

  return (
    <>
        {/* Header de Boas-vindas e Saldo */}
        <div className="flex flex-col md:flex-row justify-between items-center bg-slate-900/60 p-6 rounded-2xl border border-slate-800 shadow-lg shadow-black/40">
          <div className="w-full md:w-auto flex flex-col gap-2">
            <div className="flex items-center justify-between gap-4">
              <div>
                <h1 className="text-3xl font-bold text-white mb-1 tracking-tight">
                  Olá, <span className="text-orange-400">{session.user.name}</span>! 👋
                </h1>
                {/* Bio personalizada quando existir */}
                {/* @ts-expect-error bio adicionada dinamicamente na sessão */}
                {session.user.bio ? (
                  // @ts-expect-error bio adicionada dinamicamente na sessão
                  <p className="text-slate-400 text-sm max-w-xl">{session.user.bio}</p>
                ) : (
                  <p className="text-slate-400 text-sm">Pronto para perder dinheiro hoje?</p>
                )}
              </div>
            </div>
          </div>
          <div className="mt-4 md:mt-0 text-right space-y-2">
            <p className="text-xs text-slate-400 uppercase tracking-[0.2em]">Seu Saldo</p>
            <div className="text-4xl font-black text-green-400 font-mono">
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
            <CreateMarketRequestModalTrigger />

            <DashboardTabs 
              openMarkets={markets} 
              myBets={myBets}
              historyBets={history}
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
                    A$ {(user.balance ?? 0).toFixed(0)}
                  </span>
                </div>
              ))}
            </Card>
          </div>

      </div>
    </>
  );
}
