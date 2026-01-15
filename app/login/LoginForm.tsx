'use client';

import { useActionState } from 'react';
import { authenticate } from '@/app/lib/actions';
import { Button } from '@/components/Button';
import { Card } from '@/components/Card';
import Link from 'next/link';
import { Logo } from '@/components/Logo';

interface LoginFormProps {
  logoUrl?: string | null;
}

export function LoginForm({ logoUrl }: LoginFormProps) {
  const [errorMessage, formAction, isPending] = useActionState(
    authenticate,
    undefined,
  );

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-900 p-4">
      <Card className="w-full max-w-md border-slate-800 bg-slate-950/50 backdrop-blur-sm">
        <div className="text-center mb-8">
          <Logo className="shrink-0" logoUrl={logoUrl} />
          <p className="text-slate-400">Entre para perder (ou ganhar) Armandólars.</p>
        </div>

        <form action={formAction} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1" htmlFor="email">
              Email Corporativo
            </label>
            <input
              className="w-full rounded-md border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-white placeholder-slate-500 focus:border-orange-500 focus:outline-none focus:ring-1 focus:ring-orange-500"
              id="email"
              type="email"
              name="email"
              placeholder="fulano@firma.com"
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
            <Button className="w-full" size="lg" disabled={isPending}>
              {isPending ? 'Validando Crachá...' : 'Bater Ponto (Entrar)'}
            </Button>
          </div>
          
          <div
            className="flex h-8 items-end space-x-1"
            aria-live="polite"
            aria-atomic="true"
          >
            {errorMessage && (
              <p className="text-sm text-red-500">{errorMessage}</p>
            )}
          </div>
        </form>

        <div className="mt-6 text-center text-sm text-slate-500">
          Ainda não tem cadastro?{' '}
          <Link href="/register" className="text-orange-500 hover:underline">
            Crie sua conta
          </Link>
        </div>
      </Card>
    </div>
  );
}
