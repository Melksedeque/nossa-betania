
import { Card } from '@/components/Card';
import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';
import { redirect } from 'next/navigation';

async function getOpenMarkets() {
  return await prisma.market.findMany({
    where: { status: 'OPEN' },
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

export default async function DashboardPage() {
  const session = await auth();

  if (!session?.user) {
    redirect('/login');
  }

  const userBalance = session.user.balance;
  const markets = await getOpenMarkets();
  const leaderboard = await getLeaderboard();

  return (
    <div className="min-h-screen bg-slate-900 p-6">
      <div className="max-w-6xl mx-auto space-y-8">
        
        {/* Header de Boas-vindas e Saldo */}
        <div className="flex flex-col md:flex-row justify-between items-center bg-slate-800/50 p-6 rounded-2xl border border-slate-700">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">
              Olá, <span className="text-orange-500">{session.user.name}</span>! 👋
            </h1>
            <p className="text-slate-400">Pronto para perder dinheiro hoje?</p>
          </div>
          <div className="mt-4 md:mt-0 text-right">
            <p className="text-sm text-slate-400 uppercase tracking-wider">Seu Saldo</p>
            <div className="text-4xl font-black text-green-400">
              A$ {userBalance.toFixed(2)}
            </div>
            {userBalance < 10 && (
              <button className="mt-2 text-xs text-orange-400 hover:text-orange-300 underline">
                Mendigar Recarga (+100 A$)
              </button>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Coluna Principal: Mercados Abertos */}
          <div className="lg:col-span-2 space-y-6">
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              🔥 Mercados Abertos
            </h2>
            
            {markets.length === 0 ? (
              <Card className="p-8 text-center border-slate-800 bg-slate-900/50">
                <p className="text-slate-500">Nenhuma aposta rolando agora. Volte ao trabalho!</p>
              </Card>
            ) : (
              markets.map((market) => (
                <Card key={market.id} className="p-6 border-slate-700 bg-slate-800 hover:border-orange-500/50 transition-colors">
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="text-lg font-bold text-white">{market.question}</h3>
                    <span className="px-2 py-1 bg-green-900/30 text-green-400 text-xs rounded-full border border-green-800">
                      OPEN
                    </span>
                  </div>
                  <p className="text-slate-400 text-sm mb-6">{market.description}</p>
                  
                  <div className="grid grid-cols-2 gap-3">
                    {market.options.map((option) => (
                      <button 
                        key={option.id}
                        className="group relative flex justify-between items-center p-3 rounded-lg bg-slate-900 border border-slate-700 hover:border-orange-500 hover:bg-slate-900/80 transition-all"
                      >
                        <span className="text-slate-300 font-medium group-hover:text-white">{option.label}</span>
                        <span className="text-orange-500 font-bold bg-orange-500/10 px-2 py-0.5 rounded text-sm">
                          x{option.odds.toFixed(2)}
                        </span>
                      </button>
                    ))}
                  </div>
                </Card>
              ))
            )}
          </div>

          {/* Sidebar: Ranking */}
          <div className="space-y-6">
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              🏆 Top Bilionários
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
