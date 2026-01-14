'use client';

import { adminUpdateMarket, adminDeleteMarket } from '@/lib/actions';
import { useState } from 'react';

type AdminMarket = {
  id: string;
  question: string;
  description: string | null;
  status: string;
  createdAt: string;
  creator?: {
    name: string | null;
    email: string;
  } | null;
  _count?: {
    options: number;
    comments: number;
  };
};

interface MarketListProps {
  markets: AdminMarket[];
}

export function MarketListAdmin({ markets }: MarketListProps) {
  const [loadingId, setLoadingId] = useState<string | null>(null);

  const handleEdit = async (market: AdminMarket) => {
    const newQuestion = window.prompt('Nova pergunta para este mercado:', market.question);
    if (newQuestion === null || newQuestion.trim() === '' || newQuestion === market.question) {
      return;
    }

    setLoadingId(market.id);
    const result = await adminUpdateMarket(market.id, { question: newQuestion.trim() });
    setLoadingId(null);

    if (result.success) {
      window.alert(result.message);
    } else {
      window.alert('Erro: ' + result.message);
    }
  };

  const handleDelete = async (market: AdminMarket) => {
    const confirmed = window.confirm(
      'ATENÇÃO: Isso removerá o mercado e todas as apostas relacionadas. Deseja continuar?',
    );
    if (!confirmed) return;

    setLoadingId(market.id);
    const result = await adminDeleteMarket(market.id);
    setLoadingId(null);

    if (result.success) {
      window.alert(result.message);
    } else {
      window.alert('Erro: ' + result.message);
    }
  };

  return (
    <div className="bg-slate-800/50 rounded-2xl border border-slate-700 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm text-slate-400">
          <thead className="bg-slate-900/50 text-slate-200 uppercase font-medium">
            <tr>
              <th className="px-6 py-4">Pergunta</th>
              <th className="px-6 py-4">Criador</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4">Criado em</th>
              <th className="px-6 py-4 text-right">Ações</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-700/50">
            {markets.map((market) => (
              <tr key={market.id} className="hover:bg-slate-700/20 transition-colors">
                <td className="px-6 py-4 max-w-md">
                  <div className="flex flex-col gap-1">
                    <span className="font-medium text-white truncate" title={market.question}>
                      {market.question}
                    </span>
                    {market.description && (
                      <span className="text-xs text-slate-500 line-clamp-2" title={market.description}>
                        {market.description}
                      </span>
                    )}
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex flex-col text-xs">
                    <span className="text-slate-200">{market.creator?.name || 'Sistema'}</span>
                    {market.creator?.email && (
                      <span className="text-slate-500">{market.creator.email}</span>
                    )}
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${
                      market.status === 'OPEN'
                        ? 'bg-green-900/30 text-green-400 border-green-700'
                        : market.status === 'SETTLED'
                        ? 'bg-blue-900/30 text-blue-400 border-blue-700'
                        : 'bg-slate-800 text-slate-300 border-slate-600'
                    }`}
                  >
                    {market.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-xs text-slate-500">
                  {new Date(market.createdAt).toLocaleDateString()}
                </td>
                <td className="px-6 py-4 text-right space-x-2">
                  <button
                    onClick={() => handleEdit(market)}
                    disabled={loadingId === market.id}
                    className="text-indigo-400 hover:text-indigo-300 disabled:opacity-50 text-xs font-medium px-3 py-1.5 rounded bg-indigo-500/10 hover:bg-indigo-500/20 transition-colors cursor-pointer"
                  >
                    Editar
                  </button>
                  <button
                    onClick={() => handleDelete(market)}
                    disabled={loadingId === market.id}
                    className="text-red-400 hover:text-red-300 disabled:opacity-50 text-xs font-medium px-3 py-1.5 rounded bg-red-500/10 hover:bg-red-500/20 transition-colors cursor-pointer"
                  >
                    Excluir
                  </button>
                </td>
              </tr>
            ))}
            {markets.length === 0 && (
              <tr>
                <td colSpan={5} className="px-6 py-8 text-center text-slate-500">
                  Nenhum mercado encontrado.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

