'use client';

import { User } from '@prisma/client';
import { toggleUserRole, deleteUser, adminGetUserDetails } from '@/app/lib/actions';
import { useState } from 'react';
import Image from 'next/image';

interface UserListProps {
  users: User[];
  currentUserId: string;
}

export function UserList({ users, currentUserId }: UserListProps) {
  const [loading, setLoading] = useState<string | null>(null);
  const [detailsLoadingId, setDetailsLoadingId] = useState<string | null>(null);
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [details, setDetails] = useState<
    | {
        user: {
          id: string;
          name: string | null;
          email: string;
          image: string | null;
          role: string;
          balance: number;
        };
        metrics: {
          totalVolumeApostado: number;
          totalApostas: number;
          ultimaAtividade: string | null;
        };
        bets: {
          id: string;
          amount: number;
          status: string;
          createdAt: string;
          option: {
            label: string;
            market: {
              id: string;
              question: string;
              status: string;
            };
          };
        }[];
        markets: {
          id: string;
          question: string;
          status: string;
          createdAt: string;
          _count: {
            comments: number;
          };
        }[];
        comments: {
          id: string;
          content: string;
          createdAt: string;
          market: {
            id: string;
            question: string;
          };
        }[];
      }
    | null
  >(null);

  const handleToggleRole = async (userId: string) => {
    if (!confirm('Tem certeza que deseja alterar o cargo deste usuário?')) return;
    
    setLoading(userId);
    const result = await toggleUserRole(userId);
    setLoading(null);

    if (result.success) {
      alert(result.message);
    } else {
      alert('Erro: ' + result.message);
    }
  };

  const handleDelete = async (userId: string) => {
    if (!confirm('ATENÇÃO: Isso removerá o usuário permanentemente. Continuar?')) return;
    
    setLoading(userId);
    const result = await deleteUser(userId);
    setLoading(null);

    if (result.success) {
      alert(result.message);
    } else {
      alert('Erro: ' + result.message);
    }
  };

  const handleViewDetails = async (userId: string) => {
    setDetailsLoadingId(userId);
    setSelectedUserId(userId);
    const result = await adminGetUserDetails(userId);
    setDetailsLoadingId(null);

    if (!result.success || !result.data) {
      alert('Erro: ' + (result.message ?? 'Não foi possível carregar os detalhes do usuário.'));
      setSelectedUserId(null);
      setDetails(null);
      return;
    }

    setDetails(result.data);
  };

  return (
    <div className="bg-slate-800/50 rounded-2xl border border-slate-700 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm text-slate-400">
          <thead className="bg-slate-900/50 text-slate-200 uppercase font-medium">
            <tr>
              <th className="px-6 py-4">Nome / Email</th>
              <th className="px-6 py-4">Cargo</th>
              <th className="px-6 py-4">Saldo</th>
              <th className="px-6 py-4 text-right">Ações</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-700/50">
            {users.map((user) => (
              <tr key={user.id} className="hover:bg-slate-700/20 transition-colors">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-slate-700 flex items-center justify-center overflow-hidden">
                      {user.image ? (
                        <Image 
                          src={user.image}
                          alt={user.name || ''}
                          width={32}
                          height={32}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <span className="text-xs font-bold text-slate-400">
                          {user.name?.[0]?.toUpperCase() || '?'}
                        </span>
                      )}
                    </div>
                    <div>
                      <div className="font-medium text-white">{user.name || 'Sem nome'}</div>
                      <div className="text-xs text-slate-500">{user.email}</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      user.role === 'ADMIN'
                        ? 'bg-purple-500/10 text-purple-400 border border-purple-500/20'
                        : 'bg-slate-700/50 text-slate-400 border border-slate-700'
                    }`}
                  >
                    {user.role}
                  </span>
                </td>
                <td className="px-6 py-4 text-emerald-400 font-medium">
                  R$ {user.balance.toFixed(2)}
                </td>
                <td className="px-6 py-4 text-right space-x-2">
                  {user.id !== currentUserId && (
                    <>
                      <button
                        onClick={() => handleToggleRole(user.id)}
                        disabled={loading === user.id}
                        className="text-indigo-400 hover:text-indigo-300 disabled:opacity-50 text-xs font-medium px-3 py-1.5 rounded bg-indigo-500/10 hover:bg-indigo-500/20 transition-colors"
                      >
                        {user.role === 'ADMIN' ? 'Rebaixar' : 'Promover'}
                      </button>
                      <button
                        onClick={() => handleDelete(user.id)}
                        disabled={loading === user.id}
                        className="text-red-400 hover:text-red-300 disabled:opacity-50 text-xs font-medium px-3 py-1.5 rounded bg-red-500/10 hover:bg-red-500/20 transition-colors"
                      >
                        Banir
                      </button>
                      <button
                        onClick={() => handleViewDetails(user.id)}
                        disabled={detailsLoadingId === user.id}
                        className="text-amber-400 hover:text-amber-300 disabled:opacity-50 text-xs font-medium px-3 py-1.5 rounded bg-amber-500/10 hover:bg-amber-500/20 transition-colors"
                      >
                        {detailsLoadingId === user.id ? 'Carregando...' : 'Detalhes'}
                      </button>
                    </>
                  )}
                  {user.id === currentUserId && (
                    <span className="text-xs text-slate-600 italic">Você</span>
                  )}
                </td>
              </tr>
            ))}
            {users.length === 0 && (
              <tr>
                <td colSpan={4} className="px-6 py-8 text-center text-slate-500">
                  Nenhum usuário encontrado.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      {selectedUserId && details && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
          <div className="bg-slate-900 rounded-2xl border border-slate-700 max-w-3xl w-full max-h-[80vh] overflow-hidden flex flex-col">
            <div className="px-6 py-4 border-b border-slate-700 flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-white">
                  Detalhes do Usuário
                </h3>
                <p className="text-xs text-slate-400">
                  {details.user.name || 'Sem nome'} · {details.user.email}
                </p>
              </div>
              <button
                onClick={() => {
                  setSelectedUserId(null);
                  setDetails(null);
                }}
                className="text-slate-400 hover:text-slate-200 text-sm"
              >
                Fechar
              </button>
            </div>
            <div className="px-6 py-4 space-y-4 overflow-y-auto text-sm text-slate-300">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-slate-800/60 rounded-xl p-4 border border-slate-700/80">
                  <div className="text-xs text-slate-400 uppercase tracking-wide">Saldo</div>
                  <div className="text-xl font-bold text-emerald-400 mt-1">
                    R$ {details.user.balance.toFixed(2)}
                  </div>
                </div>
                <div className="bg-slate-800/60 rounded-xl p-4 border border-slate-700/80">
                  <div className="text-xs text-slate-400 uppercase tracking-wide">Volume Apostado</div>
                  <div className="text-xl font-bold text-amber-400 mt-1">
                    R$ {details.metrics.totalVolumeApostado.toFixed(2)}
                  </div>
                  <div className="text-[11px] text-slate-500 mt-1">
                    {details.metrics.totalApostas} apostas
                  </div>
                </div>
                <div className="bg-slate-800/60 rounded-xl p-4 border border-slate-700/80">
                  <div className="text-xs text-slate-400 uppercase tracking-wide">Última atividade</div>
                  <div className="text-sm font-medium text-slate-200 mt-1">
                    {details.metrics.ultimaAtividade
                      ? new Date(details.metrics.ultimaAtividade).toLocaleString()
                      : 'Nenhuma atividade registrada'}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h4 className="text-xs font-semibold text-slate-400 uppercase mb-2">
                    Últimas Apostas
                  </h4>
                  <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                    {details.bets.length === 0 && (
                      <p className="text-xs text-slate-500">Nenhuma aposta realizada.</p>
                    )}
                    {details.bets.map(bet => (
                      <div
                        key={bet.id}
                        className="bg-slate-800/60 border border-slate-700 rounded-lg p-2 flex justify-between gap-3"
                      >
                        <div className="flex-1 min-w-0">
                          <div className="text-[11px] text-slate-400 truncate" title={bet.option.market.question}>
                            {bet.option.market.question}
                          </div>
                          <div className="text-[11px] text-slate-500">
                            Opção: {bet.option.label}
                          </div>
                          <div className="text-[10px] text-slate-600">
                            {new Date(bet.createdAt).toLocaleString()}
                          </div>
                        </div>
                        <div className="text-right text-[11px] flex flex-col items-end justify-between">
                          <div className="text-emerald-400 font-mono">
                            A$ {bet.amount.toFixed(2)}
                          </div>
                          <span
                            className={`mt-1 inline-flex items-center px-2 py-0.5 rounded-full border text-[10px] font-medium
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
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="text-xs font-semibold text-slate-400 uppercase mb-2">
                    Mercados Criados
                  </h4>
                  <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                    {details.markets.length === 0 && (
                      <p className="text-xs text-slate-500">Nenhum mercado criado.</p>
                    )}
                    {details.markets.map(market => (
                      <div
                        key={market.id}
                        className="bg-slate-800/60 border border-slate-700 rounded-lg p-2"
                      >
                        <div className="text-[11px] text-slate-200 truncate" title={market.question}>
                          {market.question}
                        </div>
                        <div className="flex justify-between items-center mt-1 text-[11px] text-slate-500">
                          <span>
                            {new Date(market.createdAt).toLocaleDateString()} · {market._count.comments} comentários
                          </span>
                          <span
                            className={`inline-flex items-center px-2 py-0.5 rounded-full border text-[10px] font-medium
                              ${
                                market.status === 'OPEN'
                                  ? 'bg-green-900/40 text-green-300 border-green-700'
                                  : market.status === 'SETTLED'
                                  ? 'bg-blue-900/40 text-blue-300 border-blue-700'
                                  : 'bg-slate-800 text-slate-300 border-slate-600'
                              }
                            `}
                          >
                            {market.status}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div>
                <h4 className="text-xs font-semibold text-slate-400 uppercase mb-2">
                  Comentários Recentes
                </h4>
                <div className="space-y-2 max-h-40 overflow-y-auto pr-1">
                  {details.comments.length === 0 && (
                    <p className="text-xs text-slate-500">Nenhum comentário.</p>
                  )}
                  {details.comments.map(comment => (
                    <div
                      key={comment.id}
                      className="bg-slate-800/60 border border-slate-700 rounded-lg p-2"
                    >
                      <div className="text-[11px] text-slate-400 mb-1 truncate" title={comment.market.question}>
                        {comment.market.question}
                      </div>
                      <div className="text-[12px] text-slate-200">
                        {comment.content}
                      </div>
                      <div className="text-[10px] text-slate-600 mt-1">
                        {new Date(comment.createdAt).toLocaleString()}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
