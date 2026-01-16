'use client';

import { adminUpdateMarket, adminDeleteMarket, resolveMarket } from '@/app/lib/actions';
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
  options?: {
    id: string;
    label: string;
    odds: number;
  }[];
};

interface MarketListProps {
  markets: AdminMarket[];
}

export function MarketListAdmin({ markets }: MarketListProps) {
  const [loadingId, setLoadingId] = useState<string | null>(null);
  const [selectedMarket, setSelectedMarket] = useState<AdminMarket | null>(null);
  const [selectedOptionId, setSelectedOptionId] = useState<string>('');
  const [resolving, setResolving] = useState(false);

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

  const handleOpenResolve = (market: AdminMarket) => {
    setSelectedMarket(market);
    setSelectedOptionId('');
  };

  const handleCloseResolve = () => {
    if (resolving) return;
    setSelectedMarket(null);
    setSelectedOptionId('');
  };

  const handleConfirmResolve = async () => {
    if (!selectedMarket || !selectedOptionId) return;

    const confirmed = window.confirm('Confirmar encerramento deste mercado com esta opção como vencedora?');
    if (!confirmed) return;

    setResolving(true);
    const result = await resolveMarket(selectedMarket.id, selectedOptionId);
    setResolving(false);

    if (result.success) {
      window.alert(result.message);
      setSelectedMarket(null);
      setSelectedOptionId('');
      window.location.reload();
    } else {
      window.alert('Erro: ' + result.message);
    }
  };

  return (
    <>
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
                  {market.status === 'OPEN' && (
                    <button
                      onClick={() => handleOpenResolve(market)}
                      disabled={loadingId === market.id}
                      className="text-emerald-400 hover:text-emerald-300 disabled:opacity-50 text-xs font-medium px-3 py-1.5 rounded bg-emerald-500/10 hover:bg-emerald-500/20 transition-colors cursor-pointer"
                    >
                      Encerrar
                    </button>
                  )}
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

      {selectedMarket && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
          <div className="bg-slate-900 rounded-2xl border border-slate-700 max-w-lg w-full shadow-2xl">
            <div className="px-6 py-4 border-b border-slate-700 flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-white">Encerrar mercado</h3>
                <p className="text-xs text-slate-400 mt-1">
                  Defina a opção vencedora para:{' '}
                  <span className="font-medium text-slate-100">{selectedMarket.question}</span>
                </p>
              </div>
              <button
                onClick={handleCloseResolve}
                className="text-slate-400 hover:text-slate-200 text-sm"
              >
                Fechar
              </button>
            </div>

            <div className="px-6 py-4 space-y-4">
              <div className="bg-slate-800/60 border border-slate-700 rounded-lg p-3 text-xs text-amber-300">
                ⚠️ Esta ação encerrará o mercado, pagará as apostas vencedoras e marcará as demais como perdidas.
              </div>

              <div className="space-y-2">
                {(selectedMarket.options ?? []).map((option) => (
                  <label
                    key={option.id}
                    className={`flex items-center justify-between p-3 rounded-lg border cursor-pointer transition-all ${
                      selectedOptionId === option.id
                        ? 'bg-emerald-500/20 border-emerald-500 ring-1 ring-emerald-500'
                        : 'bg-slate-800 border-slate-700 hover:border-slate-600'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <input
                        type="radio"
                        name="winningOption"
                        value={option.id}
                        checked={selectedOptionId === option.id}
                        onChange={(e) => setSelectedOptionId(e.target.value)}
                        className="w-4 h-4 text-emerald-500 bg-slate-900 border-slate-600 focus:ring-emerald-500 focus:ring-offset-slate-900"
                      />
                      <span className="text-sm text-white font-medium">{option.label}</span>
                    </div>
                    <span className="text-xs text-slate-300 bg-slate-900 px-2 py-1 rounded">
                      x{option.odds.toFixed(2)}
                    </span>
                  </label>
                ))}
              </div>

              <button
                onClick={handleConfirmResolve}
                disabled={!selectedOptionId || resolving}
                className="w-full mt-2 px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-sm font-semibold text-white cursor-pointer"
              >
                {resolving ? 'Encerrando...' : 'Confirmar Vencedor e Encerrar Mercado'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
