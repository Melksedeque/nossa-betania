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
  
  // Estado para opções personalizadas
  const [options, setOptions] = useState([
    { label: 'Sim', odds: 1.90 },
    { label: 'Não', odds: 1.90 },
  ]);

  const [error, setError] = useState<string | null>(null);
  const [isPending, setIsPending] = useState(false);

  const handleOptionChange = (index: number, field: 'label' | 'odds', value: string | number) => {
    const newOptions = [...options];
    if (field === 'label') {
      newOptions[index].label = value as string;
    } else {
      newOptions[index].odds = Number(value);
    }
    setOptions(newOptions);
  };

  const addOption = () => {
    setOptions([...options, { label: `Opção ${options.length + 1}`, odds: 1.50 }]);
  };

  const removeOption = (index: number) => {
    if (options.length <= 2) {
      alert('Você precisa de pelo menos 2 opções!');
      return;
    }
    const newOptions = options.filter((_, i) => i !== index);
    setOptions(newOptions);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsPending(true);

    if (!question || !expiresAt) {
      setError('Preencha os campos obrigatórios.');
      setIsPending(false);
      return;
    }

    // Validar se todas as odds são maiores que 1.0
    const invalidOdds = options.some(opt => opt.odds <= 1.0);
    if (invalidOdds) {
      setError('Todas as odds devem ser maiores que 1.00');
      setIsPending(false);
      return;
    }

    const expirationDate = new Date(expiresAt);
    if (expirationDate <= new Date()) {
      setError('A data de encerramento deve ser no futuro.');
      setIsPending(false);
      return;
    }

    try {
      // @ts-expect-error - Ajustando para enviar odds
      const result = await createMarket(question, description, expirationDate.toISOString(), userId, options);

      if (result.success) {
        router.push('/dashboard');
      } else {
        setError(result.message);
        setIsPending(false);
      }
    } catch {
      setError('Erro de comunicação. Tente novamente.');
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
        <div className="flex justify-between items-center mb-2">
          <label className="block text-sm font-medium text-slate-300">
            Opções e Odds (Multiplicadores)
          </label>
          <button
            type="button"
            onClick={addOption}
            className="text-xs text-orange-400 hover:text-orange-300 cursor-pointer"
          >
            + Adicionar Opção
          </button>
        </div>
        
        <div className="space-y-3">
          {options.map((option, index) => (
            <div key={index} className="flex gap-2 items-center">
              <input
                type="text"
                value={option.label}
                onChange={(e) => handleOptionChange(index, 'label', e.target.value)}
                placeholder={`Opção ${index + 1}`}
                className="flex-1 bg-slate-800 border border-slate-700 rounded-md px-3 py-2 text-white text-sm focus:outline-none focus:ring-1 focus:ring-orange-500"
                required
              />
              <div className="relative w-28">
                <input
                  type="number"
                  value={option.odds}
                  onChange={(e) => handleOptionChange(index, 'odds', e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-md px-3 py-2 text-white text-sm focus:outline-none focus:ring-1 focus:ring-orange-500 text-right pr-8"
                  min="1.01"
                  step="0.01"
                  required
                />
                <span className="absolute right-3 top-2 text-slate-500 text-sm">x</span>
              </div>
              <button
                type="button"
                onClick={() => removeOption(index)}
                className="text-slate-500 hover:text-red-400 p-2 cursor-pointer"
                title="Remover opção"
              >
                ✕
              </button>
            </div>
          ))}
        </div>
        
        <div className="mt-2 text-right text-xs text-slate-500">
          Odds são os multiplicadores do retorno. Ex: 2.00 dobra o valor apostado.
        </div>
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
          className="w-full bg-slate-800 border border-slate-700 rounded-md px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-orange-500 scheme-dark"
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
          className="w-full cursor-pointer"
        >
          {isPending ? 'Criando...' : 'Criar Aposta'}
        </Button>
      </div>
    </form>
  );
}
