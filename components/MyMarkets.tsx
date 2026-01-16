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
              className="bg-slate-800 border border-slate-700 rounded-lg p-4 flex flex-col md:flex-row justify-between items-start md:items-center gap-4"
            >
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="px-2 py-0.5 rounded text-xs font-bold bg-blue-500/20 text-blue-400">
                    EM ABERTO
                  </span>
                  <span className="text-slate-500 text-xs">
                    Criada em {createdAt}
                  </span>
                </div>
                <h3 className="font-semibold text-white">{bet.option.market.question}</h3>
                <p className="text-sm text-slate-300 mt-1">
                  Sua aposta: <span className="text-orange-400 font-semibold">{bet.option.label}</span>
                </p>
              </div>

              <div className="flex flex-col items-end gap-1 text-sm">
                <span className="text-slate-400">Valor apostado</span>
                <span className="font-bold text-white">A$ {bet.amount.toFixed(2)}</span>
                <span className="text-slate-400 mt-2">Retorno potencial</span>
                <span className="font-bold text-green-400">A$ {potentialReturn.toFixed(2)}</span>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
