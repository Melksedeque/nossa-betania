'use client';

import { useState } from 'react';
import { MarketList } from './MarketList';
import { MyMarkets } from './MyMarkets';
import { BetHistory } from './BetHistory';

type DashboardMarketBase = {
  id: string;
  question: string;
  description: string | null;
  options: {
    id: string;
    label: string;
    odds: number;
    marketId: string;
  }[];
  createdAt: string;
  expiresAt: string | null;
  creatorId?: string | null;
};

type DashboardOpenMarket = DashboardMarketBase & {
  creator?: { name: string | null } | null;
};

type DashboardMyMarket = DashboardMarketBase & {
  status: string;
  outcomeId: string | null;
  creatorId: string | null;
};

type DashboardBet = {
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

interface DashboardTabsProps {
  openMarkets: DashboardOpenMarket[];
  myMarkets: DashboardMyMarket[];
  bets: DashboardBet[];
  user: {
    id: string;
    balance: number;
    name: string;
  };
}

export function DashboardTabs({ openMarkets, myMarkets, bets, user }: DashboardTabsProps) {
  const [activeTab, setActiveTab] = useState<'open' | 'mine' | 'history'>('open');

  return (
    <div className="space-y-6">
      <div className="flex space-x-4 border-b border-slate-700 pb-2">
        <button
          onClick={() => setActiveTab('open')}
          className={`pb-2 px-4 font-medium transition-colors cursor-pointer ${
            activeTab === 'open'
              ? 'text-orange-500 border-b-2 border-orange-500'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          🔥 Mercados Abertos
        </button>
        <button
          onClick={() => setActiveTab('mine')}
          className={`pb-2 px-4 font-medium transition-colors cursor-pointer ${
            activeTab === 'mine'
              ? 'text-orange-500 border-b-2 border-orange-500'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          👑 Minhas Apostas
        </button>
        <button
          onClick={() => setActiveTab('history')}
          className={`pb-2 px-4 font-medium transition-colors cursor-pointer ${
            activeTab === 'history'
              ? 'text-orange-500 border-b-2 border-orange-500'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          📜 Histórico
        </button>
      </div>

      <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
        {activeTab === 'open' && (
          <MarketList
            markets={openMarkets}
            userBalance={user.balance}
            userId={user.id}
            userName={user.name}
          />
        )}

        {activeTab === 'mine' && (
          <MyMarkets
            markets={myMarkets}
            userId={user.id}
          />
        )}

        {activeTab === 'history' && (
          <div className="space-y-3">
            <h2 className="text-xl font-bold text-white mb-2 flex items-center gap-2">
              <span>📜</span>
              <span>Histórico de Apostas</span>
            </h2>
            <BetHistory bets={bets} />
          </div>
        )}
      </div>
    </div>
  );
}
