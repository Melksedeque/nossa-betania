'use client';

import { useState } from 'react';
import { addComment, deleteComment } from '@/app/lib/actions';
import { Button } from './Button';
import { useToast } from '@/components/Toast';

type Comment = {
  id: string;
  content: string;
  createdAt: Date | string;
  userId: string;
  user: {
    name: string | null;
  };
};

interface CommentSectionProps {
  marketId: string;
  currentUser: {
    id: string;
    name: string | null;
  };
  comments: Comment[];
  marketCreatorId?: string | null;
}

export function CommentSection({ marketId, currentUser, comments: initialComments, marketCreatorId }: CommentSectionProps) {
  const [comments, setComments] = useState<Comment[]>(initialComments);
  const [newComment, setNewComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const { addToast } = useToast();

  const handleAddComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    setIsSubmitting(true);
    const result = await addComment(marketId, currentUser.id, newComment);
    setIsSubmitting(false);

    if (result.success) {
      setNewComment('');
      addToast(result.message, 'success');
      // Em uma aplicação real, idealmente usaríamos optimistic UI ou revalidaríamos os dados.
      // Aqui, vamos apenas adicionar temporariamente à lista local para feedback imediato se não houver refresh.
      // Nota: O revalidatePath no server action deve cuidar de atualizar os dados se o componente pai for server component.
      // Mas como recebemos comments via props, eles não atualizarão sozinhos sem um refresh do pai.
      // Vamos adicionar um mock local para UX instantânea:
      const tempComment: Comment = {
        id: Math.random().toString(),
        content: newComment,
        createdAt: new Date(),
        userId: currentUser.id,
        user: { name: currentUser.name },
      };
      setComments((prev) => [tempComment, ...prev]);
    } else {
      addToast(result.message, 'error');
    }
  };

  const handleDeleteComment = async (commentId: string) => {
    if (!confirm('Tem certeza que quer apagar esse comentário?')) return;

    const result = await deleteComment(commentId, currentUser.id);

    if (result.success) {
      addToast(result.message, 'success');
      setComments((prev) => prev.filter((c) => c.id !== commentId));
    } else {
      addToast(result.message, 'error');
    }
  };

  return (
    <div className="mt-4 pt-4 border-t border-slate-700/50">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="text-sm text-slate-400 hover:text-orange-400 flex items-center gap-2 cursor-pointer transition-colors"
      >
        <span>💬 {comments.length} Comentários</span>
        <span className={`transform transition-transform ${isOpen ? 'rotate-180' : ''}`}>▼</span>
      </button>

      {isOpen && (
        <div className="mt-4 space-y-4 animate-in slide-in-from-top-2 fade-in duration-200">
          {/* Lista de Comentários */}
          <div className="space-y-3 max-h-60 overflow-y-auto pr-2 custom-scrollbar">
            {comments.length === 0 ? (
              <p className="text-sm text-slate-600 italic text-center py-2">
                Ninguém falou nada ainda. Seja o primeiro!
              </p>
            ) : (
              comments.map((comment) => (
                <div key={comment.id} className="bg-slate-900/50 p-3 rounded-lg border border-slate-800 text-sm group">
                  <div className="flex justify-between items-start mb-1">
                    <span className="font-bold text-slate-300 text-xs">
                      {comment.user.name || 'Anônimo'}
                    </span>
                    <div className="flex items-center gap-2">
                      <span className="text-slate-600 text-[10px]">
                        {new Date(comment.createdAt).toLocaleDateString()}
                      </span>
                      {(currentUser.id === comment.userId || currentUser.id === marketCreatorId) && (
                        <button
                          onClick={() => handleDeleteComment(comment.id)}
                          className="text-slate-600 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                          title="Apagar comentário"
                        >
                          ✕
                        </button>
                      )}
                    </div>
                  </div>
                  <p className="text-slate-400 wrap-break-words">{comment.content}</p>
                </div>
              ))
            )}
          </div>

          {/* Formulário de Novo Comentário */}
          <form onSubmit={handleAddComment} className="flex gap-2">
            <input
              type="text"
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Digite seu comentário (trash talk liberado)..."
              className="flex-1 bg-slate-950 border border-slate-700 rounded-md px-3 py-2 text-sm text-white focus:outline-none focus:ring-1 focus:ring-orange-500"
              maxLength={500}
            />
            <Button
              type="submit"
              size="sm"
              disabled={isSubmitting || !newComment.trim()}
              className="shrink-0"
            >
              Enviar
            </Button>
          </form>
        </div>
      )}
    </div>
  );
}
