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
    { label: 'Sim', probability: 50 },
    { label: 'Não', probability: 50 },
  ]);

  const [error, setError] = useState<string | null>(null);
  const [isPending, setIsPending] = useState(false);

  const handleOptionChange = (index: number, field: 'label' | 'probability', value: string | number) => {
    const newOptions = [...options];
    if (field === 'label') {
      newOptions[index].label = value as string;
    } else {
      newOptions[index].probability = Number(value);
    }
    setOptions(newOptions);
  };

  const addOption = () => {
    setOptions([...options, { label: `Opção ${options.length + 1}`, probability: 0 }]);
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

    const totalProb = options.reduce((acc, curr) => acc + curr.probability, 0);
    if (Math.abs(totalProb - 100) > 0.1) {
      setError(`A soma das probabilidades deve ser 100%. Atual: ${totalProb}%`);
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
            Opções e Probabilidades
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
              <div className="relative w-24">
                <input
                  type="number"
                  value={option.probability}
                  onChange={(e) => handleOptionChange(index, 'probability', e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-md px-3 py-2 text-white text-sm focus:outline-none focus:ring-1 focus:ring-orange-500 text-right pr-8"
                  min="0"
                  max="100"
                  required
                />
                <span className="absolute right-3 top-2 text-slate-500 text-sm">%</span>
              </div>
              <div className="w-16 text-right text-xs text-slate-400 font-mono">
                x{option.probability > 0 ? (100 / option.probability).toFixed(2) : '∞'}
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
        
        <div className="mt-2 text-right text-sm">
          <span className={`font-bold ${Math.abs(options.reduce((acc, curr) => acc + curr.probability, 0) - 100) < 0.1 ? 'text-green-400' : 'text-red-400'}`}>
            Total: {options.reduce((acc, curr) => acc + curr.probability, 0)}%
          </span>
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
          className="w-full"
        >
          {isPending ? 'Criando...' : 'Criar Aposta'}
        </Button>
      </div>
    </form>
  );
}
