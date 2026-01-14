'use client';

import { useActionState, useEffect } from 'react';
import { updateUserProfile } from '@/app/lib/actions';
import { Button } from '@/components/Button';
import { useToast } from '@/components/Toast';

interface ProfileFormProps {
  name: string | null;
  email: string | null;
  image: string | null;
}

export function ProfileForm({ name, email, image }: ProfileFormProps) {
  const [state, formAction, isPending] = useActionState(updateUserProfile, undefined);
  const { addToast } = useToast();

  useEffect(() => {
    if (!state) return;

    addToast(state.message, state.success ? 'success' : 'error');
  }, [state, addToast]);

  return (
    <form action={formAction} className="space-y-6">
      <div className="space-y-2">
        <label className="block text-sm font-medium text-slate-300" htmlFor="name">
          Nome
        </label>
        <input
          id="name"
          name="name"
          type="text"
          defaultValue={name || ''}
          className="w-full rounded-md border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-white placeholder-slate-500 focus:border-orange-500 focus:outline-none focus:ring-1 focus:ring-orange-500"
          required
        />
      </div>

      <div className="space-y-2">
        <label className="block text-sm font-medium text-slate-300" htmlFor="email">
          Email
        </label>
        <input
          id="email"
          type="email"
          value={email || ''}
          readOnly
          className="w-full rounded-md border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-slate-400"
        />
      </div>

      <div className="space-y-2">
        <label className="block text-sm font-medium text-slate-300" htmlFor="image">
          URL do Avatar
        </label>
        <input
          id="image"
          name="image"
          type="url"
          defaultValue={image || ''}
          placeholder="https://..."
          className="w-full rounded-md border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-white placeholder-slate-500 focus:border-orange-500 focus:outline-none focus:ring-1 focus:ring-orange-500"
        />
        {image && (
          <div className="mt-3 flex items-center gap-3">
            <img
              src={image}
              alt="Avatar atual"
              className="h-12 w-12 rounded-full border border-slate-700 object-cover"
            />
            <span className="text-xs text-slate-400">Pré-visualização do avatar atual</span>
          </div>
        )}
      </div>

      <div className="pt-2">
        <Button
          type="submit"
          size="md"
          disabled={isPending}
          className="w-full"
        >
          {isPending ? 'Salvando...' : 'Salvar alterações'}
        </Button>
      </div>
    </form>
  );
}

