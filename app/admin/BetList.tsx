'use client';

import { useMemo, useState } from 'react';
import { adminUpdateBetStatus } from '@/app/lib/actions';

type AdminBet = {
  id: string;
  amount: number;
  status: string;
  createdAt: string;
  user: {
    id: string;
    name: string | null;
    email: string;
  };
  option: {
    id: string;
    label: string;
    market: {
      id: string;
      question: string;
      status: string;
    };
  };
};

interface BetListProps {
  bets: AdminBet[];
}

export function BetListAdmin({ bets }: BetListProps) {
  const [items, setItems] = useState<AdminBet[]>(bets);
  const [loadingId, setLoadingId] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [search, setSearch] = useState('');

  const filtered = useMemo(() => {
    return items.filter(bet => {
      if (statusFilter !== 'ALL' && bet.status !== statusFilter) return false;

      const term = search.trim().toLowerCase();
      if (!term) return true;

      const haystack = [
        bet.user.name || '',
        bet.user.email,
        bet.option.market.question,
        bet.option.label,
      ]
        .join(' ')
        .toLowerCase();

      return haystack.includes(term);
    });
  }, [items, statusFilter, search]);

  const handleStatusChange = async (bet: AdminBet, newStatus: string) => {
    if (newStatus === bet.status) return;

    setLoadingId(bet.id);
    const result = await adminUpdateBetStatus(bet.id, newStatus);
    setLoadingId(null);

    if (result.success) {
      setItems(prev =>
        prev.map(b => (b.id === bet.id ? { ...b, status: newStatus } : b)),
      );
      alert(result.message);
    } else {
      alert('Erro: ' + result.message);
    }
  };

  return (
    <div className="bg-slate-800/50 rounded-2xl border border-slate-700 p-4 space-y-4">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
        <div className="flex items-center gap-2 text-xs text-slate-400">
          <span className="font-semibold text-slate-200">Total:</span>
          <span>{items.length} apostas</span>
          {statusFilter !== 'ALL' && (
            <span className="text-slate-500">
              ({filtered.length} filtradas)
            </span>
          )}
        </div>
        <div className="flex flex-col md:flex-row gap-2 md:items-center">
          <select
            value={statusFilter}
            onChange={e => setStatusFilter(e.target.value)}
            className="bg-slate-900 border border-slate-700 text-xs text-slate-200 rounded-md px-2 py-1"
          >
            <option value="ALL">Todos os status</option>
            <option value="PENDING">Pendente</option>
            <option value="WON">Ganhou</option>
            <option value="LOST">Perdeu</option>
          </select>
          <input
            type="text"
            placeholder="Filtrar por usuário, mercado ou opção..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="bg-slate-900 border border-slate-700 text-xs text-slate-200 rounded-md px-2 py-1 min-w-[200px]"
          />
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="text-xs text-slate-500 text-center py-6">
          Nenhuma aposta encontrada com os filtros atuais.
        </div>
      ) : (
        <div className="overflow-x-auto max-h-96">
          <table className="w-full text-left text-xs text-slate-400">
            <thead className="bg-slate-900/60 text-slate-200 uppercase font-medium">
              <tr>
                <th className="px-3 py-2">Usuário</th>
                <th className="px-3 py-2">Mercado</th>
                <th className="px-3 py-2">Opção</th>
                <th className="px-3 py-2">Valor</th>
                <th className="px-3 py-2">Status</th>
                <th className="px-3 py-2">Criada em</th>
                <th className="px-3 py-2 text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-700/50">
              {filtered.map(bet => (
                <tr key={bet.id} className="hover:bg-slate-700/20">
                  <td className="px-3 py-2 align-top">
                    <div className="flex flex-col">
                      <span className="text-slate-200 text-[11px]">
                        {bet.user.name || 'Sem nome'}
                      </span>
                      <span className="text-slate-500 text-[10px]">
                        {bet.user.email}
                      </span>
                    </div>
                  </td>
                  <td className="px-3 py-2 align-top max-w-xs">
                    <span
                      className="text-slate-200 text-[11px] block truncate"
                      title={bet.option.market.question}
                    >
                      {bet.option.market.question}
                    </span>
                    <span className="text-slate-500 text-[10px]">
                      ID: {bet.option.market.id}
                    </span>
                  </td>
                  <td className="px-3 py-2 align-top text-[11px] text-slate-300">
                    {bet.option.label}
                  </td>
                  <td className="px-3 py-2 align-top text-[11px] text-emerald-400 font-mono">
                    A$ {bet.amount.toFixed(2)}
                  </td>
                  <td className="px-3 py-2 align-top text-[11px]">
                    <span
                      className={`inline-flex items-center px-2 py-0.5 rounded-full border text-[10px] font-medium
                        ${
                          bet.status === 'PENDING'
                            ? 'bg-yellow-900/40 text-yellow-300 border-yellow-700'
                            : bet.status === 'WON'
                            ? 'bg-green-900/40 text-green-300 border-green-700'
                            : 'bg-red-900/40 text-red-300 border-red-700'
                        }
                      `}
                    >
                      {bet.status}
                    </span>
                  </td>
                  <td className="px-3 py-2 align-top text-[11px] text-slate-500">
                    {new Date(bet.createdAt).toLocaleString()}
                  </td>
                  <td className="px-3 py-2 align-top text-right">
                    <select
                      value={bet.status}
                      onChange={e => handleStatusChange(bet, e.target.value)}
                      disabled={loadingId === bet.id}
                      className="bg-slate-900 border border-slate-700 text-[11px] text-slate-200 rounded-md px-2 py-1"
                    >
                      <option value="PENDING">Pendente</option>
                      <option value="WON">Ganhou</option>
                      <option value="LOST">Perdeu</option>
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

