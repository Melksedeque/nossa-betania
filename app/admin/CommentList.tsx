'use client';

import { useState } from 'react';
import { adminUpdateComment, adminDeleteComment } from '@/app/lib/actions';

type AdminComment = {
  id: string;
  content: string;
  createdAt: string;
  user: {
    name: string | null;
    email: string;
  };
  market: {
    id: string;
    question: string;
  };
};

interface CommentListProps {
  comments: AdminComment[];
}

export function CommentListAdmin({ comments }: CommentListProps) {
  const [items, setItems] = useState<AdminComment[]>(comments);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingContent, setEditingContent] = useState('');
  const [loadingId, setLoadingId] = useState<string | null>(null);

  const startEdit = (comment: AdminComment) => {
    setEditingId(comment.id);
    setEditingContent(comment.content);
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditingContent('');
  };

  const handleSave = async (commentId: string) => {
    if (!editingContent.trim()) return;

    setLoadingId(commentId);
    const result = await adminUpdateComment(commentId, editingContent);
    setLoadingId(null);

    if (result.success) {
      setItems(prev =>
        prev.map(c => (c.id === commentId ? { ...c, content: editingContent } : c)),
      );
      cancelEdit();
      alert(result.message);
    } else {
      alert('Erro: ' + result.message);
    }
  };

  const handleDelete = async (commentId: string) => {
    const confirmed = window.confirm(
      'ATENÇÃO: Isso removerá o comentário permanentemente. Deseja continuar?',
    );
    if (!confirmed) return;

    setLoadingId(commentId);
    const result = await adminDeleteComment(commentId);
    setLoadingId(null);

    if (result.success) {
      setItems(prev => prev.filter(c => c.id !== commentId));
      alert(result.message);
    } else {
      alert('Erro: ' + result.message);
    }
  };

  if (items.length === 0) {
    return (
      <div className="text-sm text-slate-500 text-center py-6">
        Nenhum comentário encontrado.
      </div>
    );
  }

  return (
    <div className="bg-slate-800/50 rounded-2xl border border-slate-700 overflow-hidden">
      <div className="max-h-96 overflow-y-auto">
        <table className="w-full text-left text-sm text-slate-400">
          <thead className="bg-slate-900/50 text-slate-200 uppercase font-medium text-xs">
            <tr>
              <th className="px-4 py-3 w-1/3">Comentário</th>
              <th className="px-4 py-3">Usuário</th>
              <th className="px-4 py-3">Aposta</th>
              <th className="px-4 py-3">Data</th>
              <th className="px-4 py-3 text-right">Ações</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-700/50">
            {items.map(comment => (
              <tr key={comment.id} className="hover:bg-slate-700/20 transition-colors">
                <td className="px-4 py-3 align-top">
                  {editingId === comment.id ? (
                    <textarea
                      value={editingContent}
                      onChange={e => setEditingContent(e.target.value)}
                      rows={3}
                      className="w-full bg-slate-900 border border-slate-600 rounded-md px-2 py-1 text-sm text-white focus:outline-none focus:ring-1 focus:ring-orange-500"
                    />
                  ) : (
                    <p className="text-slate-300 text-xs leading-snug wrap-break-word max-w-xs">
                      {comment.content}
                    </p>
                  )}
                </td>
                <td className="px-4 py-3 align-top text-xs">
                  <div className="text-slate-200 font-medium">
                    {comment.user.name || 'Sem nome'}
                  </div>
                  <div className="text-slate-500 text-[11px]">{comment.user.email}</div>
                </td>
                <td className="px-4 py-3 align-top text-xs">
                  <div className="text-slate-200 font-medium truncate max-w-xs">
                    {comment.market.question}
                  </div>
                  <div className="text-slate-500 text-[11px]">ID: {comment.market.id}</div>
                </td>
                <td className="px-4 py-3 align-top text-xs text-slate-500">
                  {new Date(comment.createdAt).toLocaleString()}
                </td>
                <td className="px-4 py-3 align-top text-right space-x-2">
                  {editingId === comment.id ? (
                    <>
                      <button
                        onClick={() => handleSave(comment.id)}
                        disabled={loadingId === comment.id}
                        className="text-emerald-400 hover:text-emerald-300 disabled:opacity-50 text-xs font-medium px-3 py-1.5 rounded bg-emerald-500/10 hover:bg-emerald-500/20 transition-colors"
                      >
                        Salvar
                      </button>
                      <button
                        onClick={cancelEdit}
                        disabled={loadingId === comment.id}
                        className="text-slate-400 hover:text-slate-300 disabled:opacity-50 text-xs font-medium px-3 py-1.5 rounded bg-slate-700/40 hover:bg-slate-700/60 transition-colors"
                      >
                        Cancelar
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        onClick={() => startEdit(comment)}
                        disabled={loadingId === comment.id}
                        className="text-indigo-400 hover:text-indigo-300 disabled:opacity-50 text-xs font-medium px-3 py-1.5 rounded bg-indigo-500/10 hover:bg-indigo-500/20 transition-colors"
                      >
                        Editar
                      </button>
                      <button
                        onClick={() => handleDelete(comment.id)}
                        disabled={loadingId === comment.id}
                        className="text-red-400 hover:text-red-300 disabled:opacity-50 text-xs font-medium px-3 py-1.5 rounded bg-red-500/10 hover:bg-red-500/20 transition-colors"
                      >
                        Excluir
                      </button>
                    </>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

