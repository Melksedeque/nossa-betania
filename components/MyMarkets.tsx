'use client';

import { useState } from 'react';
import { Market, Option } from '@prisma/client';
import { resolveMarket } from '@/app/lib/actions';
import { Button } from './Button';

type MarketProp = Omit<Market, 'createdAt' | 'expiresAt'> & {
  createdAt: string;
  expiresAt: string | null;
  options: Option[];
};

interface MyMarketsProps {
  markets: MarketProp[];
  userId: string;
}

export function MyMarkets({ markets, userId }: MyMarketsProps) {
  const [selectedMarket, setSelectedMarket] = useState<MarketProp | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedOptionId, setSelectedOptionId] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);

  const handleOpenResolve = (market: MarketProp) => {
    setSelectedMarket(market);
    setSelectedOptionId('');
    setIsModalOpen(true);
  };

  const handleResolve = async () => {
    if (!selectedMarket || !selectedOptionId) return;

    setIsLoading(true);
    const result = await resolveMarket(selectedMarket.id, selectedOptionId, userId);
    setIsLoading(false);

    if (result.success) {
      alert(result.message); // Ou usar um toast melhor depois
      setIsModalOpen(false);
      setSelectedMarket(null);
    } else {
      alert(result.message);
    }
  };

  if (markets.length === 0) {
    return (
      <div className="text-center py-8 text-slate-500 bg-slate-800/50 rounded-lg border border-slate-700/50">
        <p>Você ainda não criou nenhuma aposta.</p>
        <p className="text-sm mt-2">Clique em &quot;+ Criar Aposta&quot; para começar o caos!</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold text-orange-400 mb-4 flex items-center gap-2">
        <span>👑</span> Minhas Apostas (Eu sou a Lei)
      </h2>
      
      <div className="grid gap-4">
        {markets.map((market) => (
          <div 
            key={market.id} 
            className="bg-slate-800 border border-slate-700 rounded-lg p-4 flex flex-col md:flex-row justify-between items-start md:items-center gap-4"
          >
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className={`px-2 py-0.5 rounded text-xs font-bold ${
                  market.status === 'OPEN' ? 'bg-green-500/20 text-green-400' :
                  market.status === 'CLOSED' ? 'bg-yellow-500/20 text-yellow-400' :
                  'bg-slate-600 text-slate-300'
                }`}>
                  {market.status === 'OPEN' ? 'ABERTA' : market.status === 'CLOSED' ? 'ENCERRADA (Sem Vencedor)' : 'FINALIZADA'}
                </span>
                <span className="text-slate-500 text-xs">
                  Criado em {new Date(market.createdAt).toLocaleDateString()}
                </span>
              </div>
              <h3 className="font-semibold text-white">{market.question}</h3>
              {market.outcomeId && (
                <p className="text-sm text-green-400 mt-1">
                  Vencedor: {market.options.find(o => o.id === market.outcomeId)?.label}
                </p>
              )}
            </div>

            {market.status !== 'SETTLED' && (
              <Button 
                onClick={() => handleOpenResolve(market)}
                variant="outline"
                className="w-full md:w-auto text-sm border-orange-500/50 text-orange-400 hover:bg-orange-500/10"
              >
                ⚖️ Julgar
              </Button>
            )}
          </div>
        ))}
      </div>

      {/* Modal de Resolução */}
      {isModalOpen && selectedMarket && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-xl p-6 max-w-md w-full shadow-2xl relative animate-in fade-in zoom-in duration-200">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white"
            >
              ✕
            </button>

            <h3 className="text-xl font-bold text-white mb-2">Quem venceu?</h3>
            <p className="text-slate-400 text-sm mb-6">
              Defina o resultado de: <span className="text-white font-medium">&quot;{selectedMarket.question}&quot;</span>. 
              <br/>
              <span className="text-red-400 font-bold block mt-2">⚠️ Cuidado: Essa ação é irreversível e dispara os pagamentos imediatamente!</span>
            </p>

            <div className="space-y-3 mb-6">
              {selectedMarket.options.map((option) => (
                <label 
                  key={option.id}
                  className={`flex items-center justify-between p-4 rounded-lg border cursor-pointer transition-all ${
                    selectedOptionId === option.id 
                      ? 'bg-orange-500/20 border-orange-500 ring-1 ring-orange-500' 
                      : 'bg-slate-800 border-slate-700 hover:border-slate-600'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <input
                      type="radio"
                      name="outcome"
                      value={option.id}
                      checked={selectedOptionId === option.id}
                      onChange={(e) => setSelectedOptionId(e.target.value)}
                      className="w-4 h-4 text-orange-500 bg-slate-900 border-slate-600 focus:ring-orange-500 focus:ring-offset-slate-900"
                    />
                    <span className="text-white font-medium">{option.label}</span>
                  </div>
                  <span className="text-xs text-slate-400 bg-slate-900 px-2 py-1 rounded">
                    x{option.odds}
                  </span>
                </label>
              ))}
            </div>

            <Button
              onClick={handleResolve}
              disabled={!selectedOptionId || isLoading}
              className="w-full py-3 text-lg font-bold"
            >
              {isLoading ? 'Processando...' : 'Confirmar Vencedor 🔨'}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
