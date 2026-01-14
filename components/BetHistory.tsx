'use client';

import { Card } from '@/components/Card';

type BetHistoryItem = {
  id: string;
  amount: number;
  status: string;
  createdAt: string;
  option: {
    label: string;
    odds: number;
    market: {
      question: string;
      status: string;
      createdAt: string;
    };
  };
};

interface BetHistoryProps {
  bets: BetHistoryItem[];
}

export function BetHistory({ bets }: BetHistoryProps) {
  if (bets.length === 0) {
    return (
      <Card className="p-6 border-slate-800 bg-slate-900/50 text-center">
        <p className="text-slate-400 text-sm">
          Você ainda não fez nenhuma aposta.
        </p>
        <p className="text-slate-500 text-xs mt-1">
          Comece apostando em um dos mercados abertos.
        </p>
      </Card>
    );
  }

  return (
    <div className="space-y-3">
      {bets.map((bet) => {
        const isWon = bet.status === 'WON';
        const isLost = bet.status === 'LOST';
        const isPending = bet.status === 'PENDING';
        const potentialReturn = bet.amount * bet.option.odds;

        return (
          <Card
            key={bet.id}
            className="p-4 border-slate-800 bg-slate-900/60 flex flex-col gap-3"
          >
            <div className="flex justify-between items-start gap-3">
              <div className="flex-1 min-w-0">
                <p className="text-xs text-slate-500 mb-1">
                  {new Date(bet.createdAt).toLocaleString()}
                </p>
                <h3 className="text-sm font-semibold text-white truncate">
                  {bet.option.market.question}
                </h3>
                <p className="text-xs text-slate-400 mt-1">
                  Sua aposta: <span className="text-orange-400 font-semibold">{bet.option.label}</span>
                </p>
              </div>
              <div className="text-right text-xs">
                <p className="text-slate-400">Valor</p>
                <p className="text-white font-mono font-bold">
                  A$ {bet.amount.toFixed(2)}
                </p>
                <p className="text-slate-500 mt-1">Odds</p>
                <p className="text-orange-400 font-mono">x{bet.option.odds.toFixed(2)}</p>
              </div>
            </div>

            <div className="flex justify-between items-center text-xs mt-1">
              <span
                className={`inline-flex items-center gap-1 rounded-full px-2 py-1 border ${
                  isWon
                    ? 'border-green-500/60 bg-green-900/30 text-green-300'
                    : isLost
                    ? 'border-red-500/60 bg-red-900/30 text-red-300'
                    : 'border-yellow-500/60 bg-yellow-900/30 text-yellow-200'
                }`}
              >
                {isWon && '🏆 VENCEU'}
                {isLost && '💀 PERDEU'}
                {isPending && '⏳ PENDENTE'}
              </span>

              <div className="text-right">
                <p className="text-slate-400">
                  {isPending ? 'Retorno Potencial' : 'Retorno'}
                </p>
                <p className="font-mono font-bold text-sm text-green-400">
                  A$ {potentialReturn.toFixed(2)}
                </p>
              </div>
            </div>
          </Card>
        );
      })}
    </div>
  );
}

