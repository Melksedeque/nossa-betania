'use client';

import { Card } from './Card';

type MyBet = {
  id: string;
  amount: number;
  status: string;
  createdAt: string;
  option: {
    label: string;
    odds: number;
    market: {
      id: string;
      question: string;
      status: string;
      createdAt: string;
    };
  };
};

interface MyMarketsProps {
  bets: MyBet[];
}

export function MyMarkets({ bets }: MyMarketsProps) {
  if (bets.length === 0) {
    return (
      <div className="space-y-3">
        <h2 className="text-xl font-bold text-orange-400 mb-2 flex items-center gap-2">
          <span>👑</span> Minhas Apostas
        </h2>
        <div className="text-center py-8 text-slate-500 bg-slate-800/50 rounded-lg border border-slate-700/50">
          <p>Você ainda não tem apostas em andamento.</p>
          <p className="text-sm mt-2">Quando você apostar em algum mercado, ele aparece aqui.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold text-orange-400 mb-4 flex items-center gap-2">
        <span>👑</span> Minhas Apostas
      </h2>

      <div className="grid gap-4">
        {bets.map((bet) => {
          const createdAt = new Date(bet.createdAt).toLocaleString();
          const potentialReturn = bet.amount * bet.option.odds;

          return (
            <Card
              key={bet.id}
              className="bg-slate-800 border border-slate-700 rounded-lg p-4 space-y-4"
            >
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <span className="px-2 py-0.5 rounded text-xs font-bold bg-blue-500/20 text-blue-400">
                    EM ABERTO
                  </span>
                  <span className="text-slate-500 text-xs">
                    Criada em {createdAt}
                  </span>
                </div>
                <h3 className="font-semibold text-white mb-1">{bet.option.market.question}</h3>
                <p className="text-sm text-slate-300">
                  Sua aposta:{' '}
                  <span className="text-orange-400 font-semibold">{bet.option.label}</span>
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="bg-slate-900/60 border border-slate-700 rounded-lg p-3">
                  <span className="text-xs text-slate-400 block mb-1">Valor apostado</span>
                  <span className="text-lg font-bold text-white">A$ {bet.amount.toFixed(2)}</span>
                </div>
                <div className="bg-green-900/20 border border-green-700 rounded-lg p-3">
                  <span className="text-xs text-slate-400 block mb-1">Retorno potencial</span>
                  <span className="text-lg font-bold text-green-400">A$ {potentialReturn.toFixed(2)}</span>
                </div>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
