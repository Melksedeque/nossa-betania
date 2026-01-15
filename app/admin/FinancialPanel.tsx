'use client';

import { useState, useEffect } from 'react';
import { adminGetFinancialStats } from '@/app/lib/actions';

type Period = '24h' | '7d' | '30d' | 'all';

interface Transaction {
  id: string;
  date: string;
  user: string | null;
  market: string;
  option: string;
  odds: number;
  amount: number;
  payout: number;
  status: string;
  profit: number;
}

interface FinancialStats {
  totalIn: number;
  totalOut: number;
  netProfit: number;
  pendingLiability: number;
  count: number;
}

export function FinancialPanel() {
  const [period, setPeriod] = useState<Period>('30d');
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<FinancialStats | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]);

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      try {
        const result = await adminGetFinancialStats(period);
        if (result.success && result.data) {
          setStats(result.data.stats);
          setTransactions(result.data.transactions);
        }
      } catch (error) {
        console.error('Failed to load financial stats:', error);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [period]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h2 className="text-xl font-bold text-white">Painel Financeiro</h2>
        
        <div className="flex bg-slate-800 rounded-lg p-1 border border-slate-700">
          {(['24h', '7d', '30d', 'all'] as Period[]).map((p) => (
            <button
              key={p}
              onClick={() => setPeriod(p)}
              className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
                period === p
                  ? 'bg-amber-500 text-white'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-700'
              }`}
            >
              {p === '24h' ? 'Hoje' : p === '7d' ? '7 Dias' : p === '30d' ? '30 Dias' : 'Tudo'}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="py-12 text-center text-slate-500">Carregando dados financeiros...</div>
      ) : stats ? (
        <>
          {/* Métricas */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-slate-800/50 p-4 rounded-xl border border-slate-700">
              <div className="text-xs text-slate-400 mb-1">Entradas (Volume)</div>
              <div className="text-xl font-bold text-green-400">
                R$ {stats.totalIn.toFixed(2)}
              </div>
              <div className="text-xs text-slate-500 mt-1">{stats.count} transações</div>
            </div>

            <div className="bg-slate-800/50 p-4 rounded-xl border border-slate-700">
              <div className="text-xs text-slate-400 mb-1">Saídas (Prêmios)</div>
              <div className="text-xl font-bold text-red-400">
                R$ {stats.totalOut.toFixed(2)}
              </div>
            </div>

            <div className="bg-slate-800/50 p-4 rounded-xl border border-slate-700">
              <div className="text-xs text-slate-400 mb-1">Lucro Líquido</div>
              <div className={`text-xl font-bold ${stats.netProfit >= 0 ? 'text-blue-400' : 'text-red-500'}`}>
                R$ {stats.netProfit.toFixed(2)}
              </div>
            </div>

            <div className="bg-slate-800/50 p-4 rounded-xl border border-slate-700 relative overflow-hidden">
              <div className="absolute top-0 right-0 p-2 opacity-10 text-orange-500">
                ⚠️
              </div>
              <div className="text-xs text-slate-400 mb-1">Passivo Pendente</div>
              <div className="text-xl font-bold text-orange-400">
                R$ {stats.pendingLiability.toFixed(2)}
              </div>
              <div className="text-xs text-slate-500 mt-1">Potencial de saída</div>
            </div>
          </div>

          {/* Tabela de Transações */}
          <div className="bg-slate-800/50 rounded-2xl border border-slate-700 overflow-hidden">
            <div className="p-4 border-b border-slate-700">
              <h3 className="font-semibold text-slate-200">Histórico de Transações</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="bg-slate-800 text-slate-400 uppercase text-xs">
                  <tr>
                    <th className="px-4 py-3">Data</th>
                    <th className="px-4 py-3">Usuário</th>
                    <th className="px-4 py-3">Aposta</th>
                    <th className="px-4 py-3 text-right">Valor</th>
                    <th className="px-4 py-3 text-right">Retorno</th>
                    <th className="px-4 py-3 text-right">Lucro (Casa)</th>
                    <th className="px-4 py-3 text-center">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-700">
                  {transactions.map((tx) => (
                    <tr key={tx.id} className="hover:bg-slate-700/30 transition-colors">
                      <td className="px-4 py-3 text-slate-300 whitespace-nowrap">
                        {new Date(tx.date).toLocaleDateString('pt-BR')} <br/>
                        <span className="text-xs text-slate-500">{new Date(tx.date).toLocaleTimeString('pt-BR', {hour: '2-digit', minute:'2-digit'})}</span>
                      </td>
                      <td className="px-4 py-3 text-slate-300">
                        {tx.user || 'Anônimo'}
                      </td>
                      <td className="px-4 py-3 text-slate-300">
                        <div className="truncate max-w-[200px]" title={tx.market}>
                          {tx.market}
                        </div>
                        <div className="text-xs text-slate-500 mt-0.5">
                          {tx.option} (x{tx.odds})
                        </div>
                      </td>
                      <td className="px-4 py-3 text-right font-medium text-green-400">
                        R$ {tx.amount.toFixed(2)}
                      </td>
                      <td className="px-4 py-3 text-right text-slate-400">
                        {tx.payout > 0 ? `R$ ${tx.payout.toFixed(2)}` : '-'}
                      </td>
                      <td className={`px-4 py-3 text-right font-medium ${tx.profit >= 0 ? 'text-blue-400' : 'text-red-400'}`}>
                        R$ {tx.profit.toFixed(2)}
                      </td>
                      <td className="px-4 py-3 text-center">
                        <span className={`px-2 py-1 rounded text-xs font-medium ${
                          tx.status === 'WON' 
                            ? 'bg-green-500/10 text-green-500' 
                            : tx.status === 'LOST' 
                            ? 'bg-red-500/10 text-red-500' 
                            : 'bg-yellow-500/10 text-yellow-500'
                        }`}>
                          {tx.status === 'WON' ? 'VENCEU' : tx.status === 'LOST' ? 'PERDEU' : 'PENDENTE'}
                        </span>
                      </td>
                    </tr>
                  ))}
                  {transactions.length === 0 && (
                    <tr>
                      <td colSpan={7} className="px-4 py-8 text-center text-slate-500">
                        Nenhuma transação encontrada neste período.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </>
      ) : null}
    </div>
  );
}
