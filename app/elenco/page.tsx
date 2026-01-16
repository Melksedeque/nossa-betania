import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import Image from "next/image";

export default async function ElencoPage() {
  const [session, logoSetting] = await Promise.all([
    auth(),
    prisma.systemSetting.findUnique({ where: { key: "logo_url" } }),
  ]);

  const isLoggedIn = !!session?.user;
  const logoUrl = logoSetting?.value;

  const users = await prisma.user.findMany({
    where: { role: "USER" },
    orderBy: { name: "asc" },
    select: {
      id: true,
      name: true,
      bio: true,
      image: true,
      situation: true,
    },
  });

  const ativos = users.filter((u) => u.situation === "ATIVO");
  const exilados = users.filter((u) => u.situation === "EXILADO");

  return (
    <div className="flex flex-col min-h-screen bg-slate-900">
      <SiteHeader isLoggedIn={isLoggedIn} logoUrl={logoUrl} />

      <main className="flex-1 py-16">
        <div className="container mx-auto px-4 max-w-6xl space-y-12">
          <header className="text-center max-w-2xl mx-auto">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Elenco do Caos Corporativo
            </h1>
            <p className="text-slate-400 text-sm md:text-base">
              Aqui estão os personagens oficiais da Nossa Betânia: quem ainda está na
              firma segurando o rojão e quem já pediu as contas, mas deixou sua
              marca eterna no caos.
            </p>
          </header>

          {/* Ativos */}
          <section>
            <h2 className="text-2xl font-bold text-white mb-4">Ativos</h2>
            {ativos.length === 0 ? (
              <p className="text-slate-500 text-sm">
                Ainda não temos ninguém oficialmente ativo no elenco.
              </p>
            ) : (
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {ativos.map((user) => (
                  <article
                    key={user.id}
                    className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 flex flex-col gap-3 shadow-lg shadow-black/30"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-full bg-slate-800 border border-slate-700 overflow-hidden relative">
                        {user.image ? (
                          <Image
                            src={user.image}
                            alt={user.name || "Usuário"}
                            fill
                            className="object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-sm font-bold text-white">
                            {user.name?.[0] ?? "U"}
                          </div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="text-base font-semibold text-white truncate">
                          {user.name}
                        </h3>
                        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/40 uppercase tracking-wide">
                          Ativo
                        </span>
                      </div>
                    </div>
                    {user.bio && (
                      <p className="text-slate-400 text-sm leading-relaxed">
                        {user.bio}
                      </p>
                    )}
                  </article>
                ))}
              </div>
            )}
          </section>

          {/* Exilados */}
          <section>
            <h2 className="text-2xl font-bold text-white mb-4">Exilados</h2>
            {exilados.length === 0 ? (
              <p className="text-slate-500 text-sm">
                Ainda não temos exilados registrados. Milagre corporativo?
              </p>
            ) : (
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {exilados.map((user) => (
                  <article
                    key={user.id}
                    className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 flex flex-col gap-3 shadow-lg shadow-black/30"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-full bg-slate-800 border border-slate-700 overflow-hidden relative">
                        {user.image ? (
                          <Image
                            src={user.image}
                            alt={user.name || "Usuário"}
                            fill
                            className="object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-sm font-bold text-white">
                            {user.name?.[0] ?? "U"}
                          </div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="text-base font-semibold text-white truncate">
                          {user.name}
                        </h3>
                        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold bg-rose-500/10 text-rose-400 border border-rose-500/40 uppercase tracking-wide">
                          Exilado
                        </span>
                      </div>
                    </div>
                    {user.bio && (
                      <p className="text-slate-400 text-sm leading-relaxed">
                        {user.bio}
                      </p>
                    )}
                  </article>
                ))}
              </div>
            )}
          </section>
        </div>
      </main>

      <SiteFooter logoUrl={logoUrl} />
    </div>
  );
}

