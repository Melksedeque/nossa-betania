'use client';

import { useFormState, useFormStatus } from 'react-dom';
import { sendContactEmail } from '@/app/lib/actions';
import { Button } from '@/components/Button';

type ContactState = {
  success: boolean;
  message: string;
};

const initialState: ContactState = {
  success: false,
  message: '',
};

function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <Button
      type="submit"
      size="md"
      className="cursor-pointer w-full md:w-auto"
      disabled={pending}
    >
      {pending ? 'Enviando...' : 'Enviar Mensagem'}
    </Button>
  );
}

export function ContactForm() {
  const [state, formAction] = useFormState(sendContactEmail, initialState);

  return (
    <form action={formAction} className="space-y-6 max-w-xl">
      <div className="grid md:grid-cols-2 gap-4">
        <div className="flex flex-col gap-2">
          <label htmlFor="name" className="text-sm font-medium text-slate-200">
            Seu nome
          </label>
          <input
            id="name"
            name="name"
            type="text"
            required
            className="rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-slate-100 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
            placeholder="Dona do RH, Dev, Estagiário..."
          />
        </div>

        <div className="flex flex-col gap-2">
          <label htmlFor="email" className="text-sm font-medium text-slate-200">
            Seu e-mail
          </label>
          <input
            id="email"
            name="email"
            type="email"
            required
            className="rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-slate-100 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
            placeholder="voce@empresa.com"
          />
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <label htmlFor="message" className="text-sm font-medium text-slate-200">
          Mensagem
        </label>
        <textarea
          id="message"
          name="message"
          required
          rows={5}
          className="rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-slate-100 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 resize-none"
          placeholder="Conte seu caos corporativo, sugestão ou elogio irônico."
        />
      </div>

      <div className="flex flex-col gap-3">
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
  );
}

