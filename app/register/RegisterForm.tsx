'use client';

import { useActionState, useEffect } from 'react';
import { register } from '@/app/lib/actions';
import { Button } from '@/components/Button';
import { Card } from '@/components/Card';
import Link from 'next/link';
import { useToast } from '@/components/Toast';
import { Logo } from '@/components/Logo';

interface RegisterFormProps {
  logoUrl?: string | null;
}

export function RegisterForm({ logoUrl }: RegisterFormProps) {
  const [state, formAction, isPending] = useActionState(register, undefined);

  const { addToast } = useToast();

  useEffect(() => {
    if (!state) return;

    addToast(state, state.includes('sucesso') ? 'success' : 'error');
  }, [state, addToast]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-900 p-4">
      <Card className="w-full max-w-md border-slate-800 bg-slate-950/50 backdrop-blur-sm">
        <div className="container mx-auto px-4 text-center flex flex-col items-center">
          <div className="mb-4">
            <Logo className="shrink-0" logoUrl={logoUrl} />
          </div>
          <p className="text-slate-400 mb-6">Cadastre-se e ganhe 100 Armandólars.</p>
        </div>

        <form action={formAction} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1" htmlFor="name">
              Nome (ou Apelido de Guerra)
            </label>
            <input
              className="w-full rounded-md border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-white placeholder-slate-500 focus:border-orange-500 focus:outline-none focus:ring-1 focus:ring-orange-500"
              id="name"
              type="text"
              name="name"
              placeholder="O Estagiário"
              required
              minLength={2}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1" htmlFor="email">
              Email
            </label>
            <input
              className="w-full rounded-md border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-white placeholder-slate-500 focus:border-orange-500 focus:outline-none focus:ring-1 focus:ring-orange-500"
              id="email"
              type="email"
              name="email"
              placeholder="seu@email.com"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1" htmlFor="password">
              Senha
            </label>
            <input
              className="w-full rounded-md border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-white placeholder-slate-500 focus:border-orange-500 focus:outline-none focus:ring-1 focus:ring-orange-500"
              id="password"
              type="password"
              name="password"
              placeholder="******"
              required
              minLength={6}
            />
          </div>
          
          <div className="pt-2">
            <Button className="w-full cursor-pointer" size="lg" disabled={isPending}>
              {isPending ? 'Criando Conta...' : 'Cadastrar e Ganhar Bônus'}
            </Button>
          </div>
          
          <div
            className="mt-2"
            aria-live="polite"
            aria-atomic="true"
          >
            {state && (
              <div
                className={`text-sm w-full text-center rounded-md border px-3 py-2 ${
                  state.includes('sucesso')
                    ? 'border-green-500/60 bg-green-500/10 text-green-400'
                    : 'border-red-500/60 bg-red-500/10 text-red-300'
                }`}
              >
                {state}
              </div>
            )}
          </div>
        </form>

        <div className="mt-6 text-center text-sm text-slate-500">
          Já tem conta?{' '}
          <Link href="/login" className="text-orange-500 hover:underline">
            Faça login
          </Link>
        </div>
      </Card>
    </div>
  );
}
