import { auth } from '@/auth';
import { CreateMarketForm } from '@/components/CreateMarketForm';
import { redirect } from 'next/navigation';

export default async function CreateMarketPage() {
  const session = await auth();

  if (!session?.user?.id) {
    redirect('/login');
  }

  return (
    <div className="min-h-screen p-6">
      <div className="max-w-2xl mx-auto">
        <div className="bg-slate-800/50 p-8 rounded-2xl border border-slate-700 shadow-xl">
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-white mb-2">Criar Nova Aposta</h1>
            <p className="text-slate-400">
              Crie um mercado para a galera apostar. Lembre-se: você (ou o Admin) precisará definir o resultado depois!
            </p>
          </div>

          <div className="mb-6 rounded-xl border border-yellow-500/40 bg-yellow-500/10 p-4 text-sm text-yellow-200">
            <p className="font-semibold text-yellow-300 mb-1">Atenção: Juiz não aposta na própria aposta</p>
            <p>
              Quem cria a aposta <span className="font-semibold">não pode apostar nela</span>. Se você quiser apostar
              nesse mercado, peça para o Dono da Banca criar a aposta para você.
            </p>
          </div>
          
          <CreateMarketForm userId={session.user.id} />
        </div>
      </div>
    </div>
  );
}
