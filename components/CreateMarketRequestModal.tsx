'use client';

import { useState } from 'react';
import { useFormState, useFormStatus } from 'react-dom';
import { sendCreateMarketRequest } from '@/app/lib/actions';
import { Card } from '@/components/Card';
import { Button } from '@/components/Button';

type CreateRequestState = {
  success: boolean;
  message: string;
};

const initialState: CreateRequestState = {
  success: false,
  message: '',
};

interface CreateMarketRequestModalProps {
  isOpen: boolean;
  onClose: () => void;
}

function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <Button
      type="submit"
      size="md"
      className="cursor-pointer w-full md:w-auto"
      disabled={pending}
    >
      {pending ? 'Enviando solicitação...' : 'Enviar para o Dono da Banca'}
    </Button>
  );
}

export function CreateMarketRequestModal({ isOpen, onClose }: CreateMarketRequestModalProps) {
  const [options, setOptions] = useState<string[]>(['Sim', 'Não']);
  const [state, formAction] = useFormState(sendCreateMarketRequest, initialState);

  if (!isOpen) return null;

  const handleOptionChange = (index: number, value: string) => {
    const next = [...options];
    next[index] = value;
    setOptions(next);
  };

  const handleAddOption = () => {
    setOptions([...options, `Opção ${options.length + 1}`]);
  };

  const handleRemoveOption = (index: number) => {
    if (options.length <= 2) return;
    setOptions(options.filter((_, i) => i !== index));
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
      <Card className="w-full max-w-xl bg-slate-900 border-slate-700 relative">
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-white cursor-pointer"
        >
          ✕
        </button>

        <h2 className="text-2xl font-bold text-white mb-2">Solicitar nova aposta</h2>
        <p className="text-slate-400 text-sm mb-6">
          Preencha os detalhes do mercado que você quer criar. O Dono da Banca
          vai receber sua sugestão por e-mail e decidir se publica ou não.
        </p>

        <form action={formAction} className="space-y-5">
          <div className="flex flex-col gap-2">
            <label htmlFor="question" className="text-sm font-medium text-slate-200">
              Pergunta da aposta
            </label>
            <input
              id="question"
              name="question"
              type="text"
              required
              className="rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-slate-100 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
              placeholder="Ex: O deploy de sexta vai dar ruim?"
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-slate-200">
              Opções de resposta
            </label>
            <div className="space-y-2">
              {options.map((option, index) => (
                <div key={index} className="flex items-center gap-2">
                  <input
                    type="text"
                    name="options"
                    value={option}
                    onChange={(e) => handleOptionChange(index, e.target.value)}
                    required
                    className="flex-1 rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-slate-100 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                  />
                  <button
                    type="button"
                    onClick={() => handleRemoveOption(index)}
                    className="text-slate-500 hover:text-red-400 px-2 cursor-pointer"
                    aria-label="Remover opção"
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
            <button
              type="button"
              onClick={handleAddOption}
              className="text-xs text-orange-400 hover:text-orange-300 mt-1 self-start cursor-pointer"
            >
              + Adicionar opção
            </button>
          </div>

          <div className="flex flex-col gap-2">
            <label htmlFor="closesAt" className="text-sm font-medium text-slate-200">
              Data de encerramento sugerida
            </label>
            <input
              id="closesAt"
              name="closesAt"
              type="datetime-local"
              required
              className="rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-slate-100 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
            />
          </div>

          <div className="flex flex-col gap-3 mt-4">
            <SubmitButton />
            {state.message && (
              <p
                className={`text-sm ${
                  state.success ? 'text-green-400' : 'text-red-400'
                }`}
              >
                {state.message}
              </p>
            )}
          </div>
        </form>
      </Card>
    </div>
  );
}

export function CreateMarketRequestModalTrigger() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <div className="flex justify-end">
        <Button
          size="sm"
          variant="outline"
          className="border-orange-500 text-orange-500 hover:bg-orange-500 hover:text-white cursor-pointer"
          onClick={() => setIsOpen(true)}
        >
          + Solicitar Nova Aposta
        </Button>
      </div>
      <CreateMarketRequestModal isOpen={isOpen} onClose={() => setIsOpen(false)} />
    </>
  );
}
