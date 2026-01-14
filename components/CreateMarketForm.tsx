'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createMarket } from '@/app/lib/actions';
import { Button } from './Button';

interface CreateMarketFormProps {
  userId: string;
}

export function CreateMarketForm({ userId }: CreateMarketFormProps) {
  const router = useRouter();
  const [question, setQuestion] = useState('');
  const [description, setDescription] = useState('');
  const [expiresAt, setExpiresAt] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isPending, setIsPending] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsPending(true);

    if (!question || !expiresAt) {
      setError('Preencha os campos obrigatórios.');
      setIsPending(false);
      return;
    }

    const expirationDate = new Date(expiresAt);
    if (expirationDate <= new Date()) {
      setError('A data de encerramento deve ser no futuro.');
      setIsPending(false);
      return;
    }

    const result = await createMarket(question, description, expirationDate, userId);

    if (result.success) {
      router.push('/dashboard');
      router.refresh();
    } else {
      setError(result.message);
      setIsPending(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="p-3 bg-red-500/10 border border-red-500/50 rounded text-red-400 text-sm">
          {error}
        </div>
      )}

      <div>
        <label htmlFor="question" className="block text-sm font-medium text-slate-300 mb-1">
          Pergunta da Aposta *
        </label>
        <input
          type="text"
          id="question"
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          placeholder="Ex: O Brasil vai ganhar a Copa?"
          className="w-full bg-slate-800 border border-slate-700 rounded-md px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
          required
        />
        <p className="text-xs text-slate-500 mt-1">Seja claro e objetivo.</p>
      </div>

      <div>
        <label htmlFor="description" className="block text-sm font-medium text-slate-300 mb-1">
          Descrição (Opcional)
        </label>
        <textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Detalhes adicionais sobre a aposta..."
          rows={3}
          className="w-full bg-slate-800 border border-slate-700 rounded-md px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
        />
      </div>

      <div>
        <label htmlFor="expiresAt" className="block text-sm font-medium text-slate-300 mb-1">
          Encerra em *
        </label>
        <input
          type="datetime-local"
          id="expiresAt"
          value={expiresAt}
          onChange={(e) => setExpiresAt(e.target.value)}
          className="w-full bg-slate-800 border border-slate-700 rounded-md px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-orange-500 [color-scheme:dark]"
          required
        />
        <p className="text-xs text-slate-500 mt-1">
          Após esta data, ninguém mais poderá apostar.
        </p>
      </div>

      <div className="pt-4">
        <Button
          type="submit"
          disabled={isPending}
          className="w-full"
        >
          {isPending ? 'Criando...' : 'Criar Aposta'}
        </Button>
      </div>
    </form>
  );
}
