import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { Card } from "@/components/Card";

export default async function MarketsPage() {
  const [session, logoSetting] = await Promise.all([
    auth(),
    prisma.systemSetting.findUnique({
      where: { key: "logo_url" },
    }),
  ]);

  const isLoggedIn = !!session?.user;
  const logoUrl = logoSetting?.value;

  const [openMarkets, closedMarkets] = await Promise.all([
    prisma.market.findMany({
      where: { status: "OPEN", deletedAt: null },
      include: { options: true },
      orderBy: { createdAt: "desc" },
    }),
    prisma.market.findMany({
      where: { status: { not: "OPEN" }, deletedAt: null },
      include: { options: true },
      orderBy: { createdAt: "desc" },
    }),
  ]);

  const hasMarkets = openMarkets.length > 0 || closedMarkets.length > 0;

  return (
    <div className="flex flex-col min-h-screen bg-slate-900">
      <SiteHeader isLoggedIn={isLoggedIn} logoUrl={logoUrl} />

      <main className="flex-1 py-16">
        <div className="container mx-auto px-4 max-w-5xl">
          <header className="mb-10 text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4 text-white">
              Mercados <span className="text-orange-400">Abertos</span>
            </h1>
            <p className="text-slate-400 max-w-2xl mx-auto">
              Aqui você vê todos os mercados da Nossa Betânia. Primeiro os que ainda
              estão rolando, depois os que já foram encerrados.
            </p>
          </header>

          {!hasMarkets && (
            <Card className="p-8 text-center border-slate-800 bg-slate-900/60">
              <p className="text-slate-400">
                Nenhum mercado disponível ainda. Assim que o Dono da Banca abrir o
                primeiro caos corporativo, ele aparece aqui.
              </p>
            </Card>
          )}

          {openMarkets.length > 0 && (
            <section className="mb-12" aria-label="Mercados abertos">
              <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
                <span>🔥</span>
                <span>Rolando agora</span>
              </h2>

              <div className="space-y-4">
                {openMarkets.map((market) => (
                  <Card
                    key={market.id}
                    className="p-6 border-slate-700 bg-slate-800/80 flex flex-col gap-3"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1 min-w-0">
                        <h3 className="text-lg font-semibold text-white mb-1">
                          {market.question}
                        </h3>
                        {market.description && (
                          <p className="text-sm text-slate-400">
                            {market.description}
                          </p>
                        )}
                      </div>
                      <span className="px-2 py-1 text-xs rounded-full border border-green-700 bg-green-900/40 text-green-300">
                        ABERTO
                      </span>
                    </div>

                    <div className="grid md:grid-cols-2 gap-2 mt-2">
                      {market.options.map((option) => (
                        <div
                          key={option.id}
                          className="flex items-center justify-between rounded-lg border border-slate-700 bg-slate-900/70 px-3 py-2 text-sm"
                        >
                          <span className="text-slate-200 truncate">
                            {option.label}
                          </span>
                          <span className="font-semibold text-orange-400">
                            x{option.odds.toFixed(2)}
                          </span>
                        </div>
                      ))}
                    </div>
                  </Card>
                ))}
              </div>
            </section>
          )}

          {closedMarkets.length > 0 && (
            <section aria-label="Mercados encerrados">
              <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
                <span>📜</span>
                <span>Encerrados</span>
              </h2>

              <div className="space-y-4">
                {closedMarkets.map((market) => (
                  <Card
                    key={market.id}
                    className="p-6 border-slate-800 bg-slate-900/80 flex flex-col gap-3 opacity-80"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1 min-w-0">
                        <h3 className="text-lg font-semibold text-slate-100 mb-1">
                          {market.question}
                        </h3>
                        {market.description && (
                          <p className="text-sm text-slate-500">
                            {market.description}
                          </p>
                        )}
                      </div>
                      <span className="px-2 py-1 text-xs rounded-full border border-slate-700 bg-slate-800 text-slate-300">
                        {market.status === "SETTLED" ? "FINALIZADO" : "ENCERRADO"}
                      </span>
                    </div>
                  </Card>
                ))}
              </div>
            </section>
          )}
        </div>
      </main>

      <SiteFooter logoUrl={logoUrl} />
    </div>
  );
}

