'use client';

import { User } from '@prisma/client';
import { toggleUserRole, deleteUser } from '@/lib/actions';
import { useState } from 'react';

interface UserListProps {
  users: User[];
  currentUserId: string;
}

export function UserList({ users, currentUserId }: UserListProps) {
  const [loading, setLoading] = useState<string | null>(null);

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
                        <img src={user.image} alt={user.name || ''} className="w-full h-full object-cover" />
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
    </div>
  );
}
