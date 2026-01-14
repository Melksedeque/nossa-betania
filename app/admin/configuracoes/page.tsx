import { auth } from '@/auth';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { PasswordForm } from '../PasswordForm';

export default async function AdminSettingsPage() {
  const session = await auth();

  if (!session?.user || session.user.role !== 'ADMIN') {
    redirect('/dashboard');
  }

  return (
    <div className="min-h-screen bg-slate-900 p-6">
      <div className="max-w-2xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-white">Configurações</h1>
          <Link href="/admin" className="text-orange-500 hover:text-orange-400">
            Voltar ao Painel
          </Link>
        </div>

        <div className="bg-slate-800/50 p-6 rounded-2xl border border-slate-700">
          <h2 className="text-xl font-bold text-white mb-4">Segurança</h2>
          <div>
            <h3 className="text-sm font-semibold text-slate-200 mb-2">Alterar senha</h3>
            <p className="text-xs text-slate-400 mb-4">
              Atualize a senha da sua conta de administrador. Use uma senha forte e não compartilhe com ninguém.
            </p>
            <PasswordForm />
          </div>
        </div>
      </div>
    </div>
  );
}
