'use client';

import { useState, FormEvent } from 'react';
import { updatePassword } from '@/app/lib/actions';

export function PasswordForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState<boolean | null>(null);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSubmitting(true);
    setMessage(null);

    const formData = new FormData(event.currentTarget);
    const result = await updatePassword(undefined, formData);

    setIsSubmitting(false);
    setIsSuccess(result.success);
    setMessage(result.message);

    if (result.success) {
      event.currentTarget.reset();
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-slate-200 mb-1" htmlFor="currentPassword">
          Senha atual
        </label>
        <input
          id="currentPassword"
          name="currentPassword"
          type="password"
          required
          className="w-full rounded-lg bg-slate-900 border border-slate-700 px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-200 mb-1" htmlFor="newPassword">
          Nova senha
        </label>
        <input
          id="newPassword"
          name="newPassword"
          type="password"
          required
          className="w-full rounded-lg bg-slate-900 border border-slate-700 px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
        />
      </div>

      {message && (
        <div
          className={`text-sm px-3 py-2 rounded-lg border ${
            isSuccess
              ? 'bg-emerald-500/10 text-emerald-300 border-emerald-500/40'
              : 'bg-red-500/10 text-red-300 border-red-500/40'
          }`}
        >
          {message}
        </div>
      )}

      <button
        type="submit"
        disabled={isSubmitting}
        className="inline-flex items-center justify-center px-4 py-2 rounded-lg bg-orange-500 hover:bg-orange-400 text-sm font-medium text-white disabled:opacity-50 disabled:cursor-not-allowed transition-colors cursor-pointer"
      >
        {isSubmitting ? 'Salvando...' : 'Alterar senha'}
      </button>
    </form>
  );
}
