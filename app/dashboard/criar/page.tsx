import { auth } from '@/auth';
import { CreateMarketForm } from '@/components/CreateMarketForm';
import { redirect } from 'next/navigation';
import Link from 'next/link';

export default async function CreateMarketPage() {
  const session = await auth();

  if (!session?.user?.id) {
    redirect('/login');
  }

  return (
    <div className="min-h-screen bg-slate-900 p-6">
      <div className="max-w-2xl mx-auto">
        <Link href="/dashboard" className="text-slate-400 hover:text-white mb-6 inline-block">
          &larr; Voltar para o Dashboard
        </Link>
        
        <div className="bg-slate-800/50 p-8 rounded-2xl border border-slate-700 shadow-xl">
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-white mb-2">Criar Nova Aposta</h1>
            <p className="text-slate-400">
              Crie um mercado para a galera apostar. Lembre-se: você (ou o Admin) precisará definir o resultado depois!
            </p>
          </div>
          
          <CreateMarketForm userId={session.user.id} />
        </div>
      </div>
    </div>
  );
}
