import { auth } from '@/auth';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import { PasswordForm } from '../PasswordForm';
import { adminRestoreComment, adminHardDeleteComment, adminRestoreMarket, adminHardDeleteMarket } from '@/app/lib/actions';

export default async function AdminSettingsPage() {
  const session = await auth();

  if (!session?.user || session.user.role !== 'ADMIN') {
    redirect('/dashboard');
  }

  const deletedMarkets = await prisma.market.findMany({
    where: { deletedAt: { not: null } },
    include: {
      creator: { select: { name: true, email: true } },
    },
    orderBy: { deletedAt: 'desc' },
    take: 50,
  });

  const deletedComments = await prisma.comment.findMany({
    where: { deletedAt: { not: null } },
    include: {
      user: { select: { name: true, email: true } },
      market: { select: { question: true } },
    },
    orderBy: { deletedAt: 'desc' },
    take: 100,
  });

  return (
    <div className="min-h-screen bg-slate-900 p-6">
      <div className="max-w-5xl mx-auto space-y-8">
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

        <div className="bg-slate-800/50 p-6 rounded-2xl border border-slate-700">
          <h2 className="text-xl font-bold text-white mb-4">Lixeira</h2>
          <p className="text-xs text-slate-400 mb-4">
            Itens removidos do sistema ficam armazenados aqui temporariamente. Você pode restaurar ou remover permanentemente.
          </p>

          <div className="space-y-6">
            <section>
              <h3 className="text-sm font-semibold text-slate-200 mb-2">Mercados removidos</h3>
              {deletedMarkets.length === 0 ? (
                <p className="text-xs text-slate-500">Nenhum mercado na lixeira.</p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs text-slate-400">
                    <thead className="bg-slate-900/60 text-slate-200 uppercase font-medium">
                      <tr>
                        <th className="px-3 py-2">Pergunta</th>
                        <th className="px-3 py-2">Criador</th>
                        <th className="px-3 py-2">Removido em</th>
                        <th className="px-3 py-2 text-right">Ações</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-700/60">
                      {deletedMarkets.map(market => (
                        <tr key={market.id}>
                          <td className="px-3 py-2 max-w-md">
                            <span className="text-slate-200 truncate block" title={market.question}>
                              {market.question}
                            </span>
                          </td>
                          <td className="px-3 py-2">
                            <div className="flex flex-col">
                              <span className="text-slate-200 text-[11px]">{market.creator?.name || 'Sistema'}</span>
                              {market.creator?.email && (
                                <span className="text-slate-500 text-[10px]">{market.creator.email}</span>
                              )}
                            </div>
                          </td>
                          <td className="px-3 py-2 text-[11px] text-slate-500">
                            {market.deletedAt ? new Date(market.deletedAt).toLocaleString() : '-'}
                          </td>
                          <td className="px-3 py-2 text-right space-x-2">
                            <form
                              action={async () => {
                                'use server';
                                await adminRestoreMarket(market.id);
                              }}
                              className="inline"
                            >
                              <button className="text-emerald-400 hover:text-emerald-300 text-[11px] font-medium px-3 py-1 rounded bg-emerald-500/10 hover:bg-emerald-500/20">
                                Restaurar
                              </button>
                            </form>
                            <form
                              action={async () => {
                                'use server';
                                await adminHardDeleteMarket(market.id);
                              }}
                              className="inline"
                            >
                              <button className="text-red-400 hover:text-red-300 text-[11px] font-medium px-3 py-1 rounded bg-red-500/10 hover:bg-red-500/20">
                                Excluir definitivamente
                              </button>
                            </form>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </section>

            <section>
              <h3 className="text-sm font-semibold text-slate-200 mb-2">Comentários removidos</h3>
              {deletedComments.length === 0 ? (
                <p className="text-xs text-slate-500">Nenhum comentário na lixeira.</p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs text-slate-400">
                    <thead className="bg-slate-900/60 text-slate-200 uppercase font-medium">
                      <tr>
                        <th className="px-3 py-2">Comentário</th>
                        <th className="px-3 py-2">Usuário</th>
                        <th className="px-3 py-2">Aposta</th>
                        <th className="px-3 py-2">Removido em</th>
                        <th className="px-3 py-2 text-right">Ações</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-700/60">
                      {deletedComments.map(comment => (
                        <tr key={comment.id}>
                          <td className="px-3 py-2 max-w-md">
                            <span className="text-slate-200 block truncate" title={comment.content}>
                              {comment.content}
                            </span>
                          </td>
                          <td className="px-3 py-2">
                            <div className="flex flex-col">
                              <span className="text-slate-200 text-[11px]">{comment.user.name || 'Sem nome'}</span>
                              <span className="text-slate-500 text-[10px]">{comment.user.email}</span>
                            </div>
                          </td>
                          <td className="px-3 py-2 text-[11px] text-slate-300 max-w-xs truncate">
                            {comment.market.question}
                          </td>
                          <td className="px-3 py-2 text-[11px] text-slate-500">
                            {comment.deletedAt ? new Date(comment.deletedAt).toLocaleString() : '-'}
                          </td>
                          <td className="px-3 py-2 text-right space-x-2">
                            <form
                              action={async () => {
                                'use server';
                                await adminRestoreComment(comment.id);
                              }}
                              className="inline"
                            >
                              <button className="text-emerald-400 hover:text-emerald-300 text-[11px] font-medium px-3 py-1 rounded bg-emerald-500/10 hover:bg-emerald-500/20">
                                Restaurar
                              </button>
                            </form>
                            <form
                              action={async () => {
                                'use server';
                                await adminHardDeleteComment(comment.id);
                              }}
                              className="inline"
                            >
                              <button className="text-red-400 hover:text-red-300 text-[11px] font-medium px-3 py-1 rounded bg-red-500/10 hover:bg-red-500/20">
                                Excluir definitivamente
                              </button>
                            </form>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
