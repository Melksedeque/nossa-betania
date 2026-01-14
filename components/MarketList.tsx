'use client';

import { useState } from 'react';
import { Card } from '@/components/Card';
import { BetModal } from '@/components/BetModal';

type Option = {
  id: string;
  label: string;
  odds: number;
};

type Market = {
  id: string;
  question: string;
  description: string;
  options: Option[];
};

interface MarketListProps {
  markets: Market[];
  userBalance: number;
  userId: string;
}

export function MarketList({ markets, userBalance, userId }: MarketListProps) {
  const [selectedOption, setSelectedOption] = useState<Option | null>(null);
  const [selectedMarketQuestion, setSelectedMarketQuestion] = useState<string>('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleOptionClick = (option: Option, marketQuestion: string) => {
    setSelectedOption(option);
    setSelectedMarketQuestion(marketQuestion);
    setIsModalOpen(true);
  };

  return (
    <>
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
            <Card
              key={market.id}
              className="p-6 border-slate-700 bg-slate-800 hover:border-orange-500/50 transition-colors"
            >
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
                    onClick={() => handleOptionClick(option, market.question)}
                    className="group relative flex justify-between items-center p-3 rounded-lg bg-slate-900 border border-slate-700 hover:border-orange-500 hover:bg-slate-900/80 transition-all cursor-pointer"
                  >
                    <span className="text-slate-300 font-medium group-hover:text-white">
                      {option.label}
                    </span>
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

      <BetModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        option={selectedOption}
        marketQuestion={selectedMarketQuestion}
        userBalance={userBalance}
        userId={userId}
      />
    </>
  );
}
