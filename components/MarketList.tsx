'use client';

import { useState } from 'react';
import { Card } from '@/components/Card';
import { BetModal } from '@/components/BetModal';
import { Countdown } from '@/components/Countdown';
import { CommentSection } from './CommentSection';
import { useToast } from '@/components/Toast';

type Option = {
  id: string;
  label: string;
  odds: number;
};

type Comment = {
  id: string;
  content: string;
  createdAt: Date | string;
  userId: string;
  user: {
    name: string | null;
  };
};

type Market = {
  id: string;
  question: string;
  description: string | null;
  options: Option[];
  expiresAt: Date | string | null;
  creator?: { name: string | null } | null;
  creatorId?: string | null;
  comments?: Comment[];
};

type UserBet = {
  id: string;
  option: {
    market: {
      id: string;
    };
  };
};

interface MarketListProps {
  markets: Market[];
  userBalance: number;
  userId: string;
  userName?: string | null;
  userBets?: UserBet[];
}

export function MarketList({ markets, userBalance, userId, userName, userBets }: MarketListProps) {
  const [selectedOption, setSelectedOption] = useState<Option | null>(null);
  const [selectedMarketQuestion, setSelectedMarketQuestion] = useState<string>('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { addToast } = useToast();

  const handleOptionClick = (option: Option, market: Market) => {
    if (market.expiresAt && new Date(market.expiresAt) <= new Date()) {
       return; // Expirado
    }
    if (market.creatorId === userId) {
      addToast("Você não pode apostar na sua própria criação! Isso seria conflito de interesses.", 'error');
      return;
    }
    setSelectedOption(option);
    setSelectedMarketQuestion(market.question);
    setIsModalOpen(true);
  };

  const betMarketIds = new Set((userBets || []).map((bet) => bet.option.market.id));

  return (
    <>
      <div className="space-y-6">
        {markets.length === 0 ? (
          <Card className="p-8 text-center border-slate-800 bg-slate-900/50">
            <p className="text-slate-500">Nenhuma aposta rolando agora. Crie uma!</p>
          </Card>
        ) : (
          markets.map((market) => {
             const isExpired = market.expiresAt ? new Date(market.expiresAt) <= new Date() : false;
             const hasBet = betMarketIds.has(market.id);

             return (
            <Card
              key={market.id}
              className={`p-6 border-slate-700 bg-slate-800 transition-colors ${isExpired ? 'opacity-75 grayscale' : 'hover:border-orange-500/50'}`}
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1 min-w-0 pr-4">
                  <h3 className="text-lg font-bold text-white mb-2">{market.question}</h3>
                  <div className="flex flex-wrap items-center gap-3">
                    <span className="text-xs text-slate-500 bg-slate-900 px-2 py-1 rounded">
                      Por: {market.creator?.name || 'Sistema'}
                    </span>
                  </div>
                </div>
                <div className="flex flex-col items-end gap-2">
                  {market.expiresAt && (
                    <Countdown targetDate={market.expiresAt} />
                  )}
                  {hasBet && (
                    <span className="px-2 py-1 text-xs rounded-full border border-orange-500/60 bg-orange-500/10 text-orange-400">
                      Você já apostou aqui
                    </span>
                  )}
                  <span
                    className={`px-2 py-1 text-xs rounded-full border ${
                      isExpired
                        ? 'bg-red-900/30 text-red-400 border-red-800'
                        : 'bg-green-900/30 text-green-400 border-green-800'
                    }`}
                  >
                    {isExpired ? 'ENCERRADO' : 'ABERTO'}
                  </span>
                </div>
              </div>
              
              {market.description && (
                  <p className="text-slate-400 text-sm mb-6">{market.description}</p>
              )}

              <div className="grid grid-cols-2 gap-3 mt-4">
                {market.options.map((option) => {
                  const isCreator = market.creatorId === userId;
                  return (
                  <button
                    key={option.id}
                    onClick={() => handleOptionClick(option, market)}
                    disabled={isExpired || isCreator}
                    className={`group relative flex justify-between items-center p-3 rounded-lg border transition-all 
                        ${isExpired || isCreator
                            ? 'bg-slate-800 border-slate-700 cursor-not-allowed opacity-50' 
                            : 'bg-slate-900 border-slate-700 hover:border-orange-500 hover:bg-slate-900/80 cursor-pointer'
                        }`}
                  >
                    <span className={`font-medium ${isExpired || isCreator ? 'text-slate-500' : 'text-slate-300 group-hover:text-white'}`}>
                      {option.label} {isCreator && '(JUIZ)'}
                    </span>
                    <span className={`font-bold px-2 py-0.5 rounded text-sm ${isExpired || isCreator ? 'text-slate-500 bg-slate-700' : 'text-orange-500 bg-orange-500/10'}`}>
                      x{option.odds.toFixed(2)}
                    </span>
                  </button>
                )})}
              </div>

              <CommentSection
                marketId={market.id}
                comments={market.comments || []}
                currentUser={{ id: userId, name: userName || 'Usuário' }}
                marketCreatorId={market.creatorId}
              />
            </Card>
          )})
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
