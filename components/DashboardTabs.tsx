'use client';

import { useState } from 'react';
import { MarketList } from './MarketList';
import { MyMarkets } from './MyMarkets';

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

interface DashboardTabsProps {
  openMarkets: DashboardOpenMarket[];
  myMarkets: DashboardMyMarket[];
  user: {
    id: string;
    balance: number;
    name: string;
  };
}

export function DashboardTabs({ openMarkets, myMarkets, user }: DashboardTabsProps) {
  const [activeTab, setActiveTab] = useState<'open' | 'mine'>('open');

  return (
    <div className="space-y-6">
      <div className="flex space-x-4 border-b border-slate-700 pb-2">
        <button
          onClick={() => setActiveTab('open')}
          className={`pb-2 px-4 font-medium transition-colors ${
            activeTab === 'open'
              ? 'text-orange-500 border-b-2 border-orange-500'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          🔥 Mercados Abertos
        </button>
        <button
          onClick={() => setActiveTab('mine')}
          className={`pb-2 px-4 font-medium transition-colors ${
            activeTab === 'mine'
              ? 'text-orange-500 border-b-2 border-orange-500'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          👑 Minhas Apostas
        </button>
      </div>

      <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
        {activeTab === 'open' && (
          <MarketList
            markets={openMarkets}
            userBalance={user.balance}
            userId={user.id}
          />
        )}

        {activeTab === 'mine' && (
          <MyMarkets
            markets={myMarkets}
            userId={user.id}
          />
        )}
      </div>
    </div>
  );
}
