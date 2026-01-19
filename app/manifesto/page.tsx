import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { Card } from "@/components/Card";
import Image from "next/image";

export default async function ManifestoPage() {
  const [session, logoSetting] = await Promise.all([
    auth(),
    prisma.systemSetting.findUnique({
      where: { key: "logo_url" },
    }),
  ]);

  const isLoggedIn = !!session?.user;
  const logoUrl = logoSetting?.value;

  return (
    <div className="flex flex-col min-h-screen bg-slate-900">
      <SiteHeader isLoggedIn={isLoggedIn} logoUrl={logoUrl} />

      <main className="flex-1 py-16">
        <div className="container flex items-center justify-between mx-auto px-4 max-w-6xl">
          <Card className="p-8 md:p-10 bg-slate-900/80 border-slate-800 max-w-3xl">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
              <span className="text-orange-400">Manifesto</span> da Nossa <span className="text-orange-400">Bet</span>ânia
            </h1>
            <p className="text-slate-400 mb-4 text-lg">
              A Nossa Betânia existe para transformar o caos corporativo em diversão
              controlada. Aqui, as piadas de corredor viram mercados de apostas,
              e o estresse do expediente se converte em Armandólars fictícios.
            </p>
            <p className="text-slate-400 mb-4">
              Nada aqui envolve dinheiro real. O objetivo é criar um espaço seguro
              para rir das situações absurdas do dia a dia de trabalho, sem
              prejudicar ninguém, sem explorar vício em jogo e sem prometer lucro.
            </p>
            <p className="text-slate-400 mb-4">
              A cada mercado criado, registramos pequenas histórias da firma:
              reuniões que poderiam ser um e-mail, deploys de sexta-feira,
              decisões de gestão questionáveis e o eterno sumiço do café.
            </p>
            <p className="text-slate-400 mb-4">
              Se em algum momento a brincadeira deixar de ser leve, a aposta perde
              o sentido. O compromisso da Nossa Betânia é servir como válvula de
              escape, não como mais uma fonte de pressão.
            </p>
            <p className="text-slate-400">
              Entre, aposte de forma responsável e use este espaço como um lembrete
              de que, no fim do dia, todo mundo só quer sobreviver a mais uma
              semana de caos com um pouco de bom humor.
            </p>
          </Card>
          <Image
            src="/mascote2.png"
            alt="Manifesto da Nossa Betânia"
            width={300}
            height={635}
            className="animate-float-slow"
          />
        </div>
      </main>

      <SiteFooter logoUrl={logoUrl} />
    </div>
  );
}

