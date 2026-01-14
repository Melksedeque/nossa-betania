'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/Button';
import { Card } from '@/components/Card';
import { placeBet } from '@/app/lib/actions';
import { useRouter } from 'next/navigation';

type Option = {
  id: string;
  label: string;
  odds: number;
};

interface BetModalProps {
  isOpen: boolean;
  onClose: () => void;
  option: Option | null;
  marketQuestion: string;
  userBalance: number;
  userId: string;
}

export function BetModal({
  isOpen,
  onClose,
  option,
  marketQuestion,
  userBalance,
  userId,
}: BetModalProps) {
  const [amount, setAmount] = useState<string>('');
  const [isPending, setIsPending] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    if (isOpen) {
      setAmount('');
      setMessage(null);
      setIsPending(false);
    }
  }, [isOpen]);

  if (!isOpen || !option) return null;

  const betAmount = parseFloat(amount) || 0;
  const potentialReturn = betAmount * option.odds;
  const isValidAmount = betAmount > 0 && betAmount <= userBalance;

  const handlePlaceBet = async () => {
    if (!isValidAmount) return;

    setIsPending(true);
    setMessage(null);

    const result = await placeBet(userId, option.id, betAmount);

    if (result.success) {
      setMessage(result.message);
      setTimeout(() => {
        onClose();
        setAmount('');
        setMessage(null);
        router.refresh(); // Atualiza a página para refletir o novo saldo
      }, 1500);
    } else {
      setMessage(result.message);
      setIsPending(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
      <Card className="w-full max-w-md border-slate-700 bg-slate-900 shadow-2xl relative animate-in fade-in zoom-in duration-200">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-white"
        >
          ✕
        </button>

        <div className="mb-6">
          <h2 className="text-xl font-bold text-white mb-1">Confirmar Aposta</h2>
          <p className="text-slate-400 text-sm">{marketQuestion}</p>
        </div>

        <div className="bg-slate-800 p-4 rounded-lg mb-6 border border-slate-700">
          <div className="flex justify-between items-center mb-2">
            <span className="text-slate-300">Sua Escolha:</span>
            <span className="text-orange-500 font-bold">{option.label}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-slate-300">Odds:</span>
            <span className="text-white font-mono bg-slate-700 px-2 rounded">
              x{option.odds.toFixed(2)}
            </span>
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">
              Valor da Aposta (A$)
            </label>
            <div className="relative">
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg py-3 px-4 text-white focus:border-orange-500 focus:outline-none"
                placeholder="0.00"
                min="0.01"
                step="0.01"
              />
              <span className="absolute right-4 top-3 text-slate-500 text-sm">
                Max: {userBalance.toFixed(2)}
              </span>
            </div>
          </div>

          <div className="flex justify-between items-center text-sm p-3 bg-green-900/20 border border-green-900/50 rounded-lg">
            <span className="text-green-400">Retorno Potencial:</span>
            <span className="font-bold text-green-400 text-lg">
              A$ {potentialReturn.toFixed(2)}
            </span>
          </div>

          {message && (
            <div className={`text-center text-sm p-2 rounded ${message.includes('sucesso') ? 'text-green-400 bg-green-900/20' : 'text-red-400 bg-red-900/20'}`}>
              {message}
            </div>
          )}

          <Button
            className="w-full"
            size="lg"
            onClick={handlePlaceBet}
            disabled={!isValidAmount || isPending}
          >
            {isPending ? 'Processando...' : 'Confirmar Aposta'}
          </Button>
        </div>
      </Card>
    </div>
  );
}
