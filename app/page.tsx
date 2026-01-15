import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/Button";
import { Card } from "@/components/Card";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";

export default async function Home() {
  const session = await auth();
  const isLoggedIn = !!session?.user;

  const logoSetting = await prisma.systemSetting.findUnique({
    where: { key: 'logo_url' },
  });
  const logoUrl = logoSetting?.value;

  return (
    <div className="flex flex-col min-h-screen">
      <SiteHeader isLoggedIn={isLoggedIn} logoUrl={logoUrl} />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative py-20 md:py-20 overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,var(--tw-gradient-stops))] from-orange-900/20 via-slate-900 to-slate-900 z-0" />
          
          <div className="container mx-auto px-4 relative z-10 text-center max-w-4xl">
            {logoUrl && (
              <div className="mb-8 flex justify-center">
                <div className="relative h-80 w-80 rounded-full shadow-lg shadow-orange-500/30">
                  <Image
                    src={logoUrl}
                    alt="Logo Nossa Betânia"
                    fill
                    className="object-cover"
                    sizes="300px"
                  />
                </div>
              </div>
            )}
            <div className="inline-block px-3 py-1 mb-6 rounded-full bg-orange-500/10 border border-orange-500/20 text-orange-400 text-sm font-medium animate-pulse">
              🚨 Alerta de Caos: mais uma reunião que podia ser e-mail.
            </div>
            
            <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight tracking-tight">
              A Primeira Casa de Apostas focada no<br /><span className="text-orange-500">Caos Corporativo</span>
            </h1>
            
            <p className="text-lg md:text-xl text-slate-400 mb-10 max-w-2xl mx-auto leading-relaxed">
              Aqui você aposta no que realmente importa: se o sistema vai cair,
              se o gestor vai pedir &quot;só um ajuste rápido&quot; às 17:59 ou se o café vai acabar
              antes das 10h. Estresse real, lucro fictício e muita terapia em forma de aposta.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/register">
                <Button size="lg" className="w-full sm:w-auto cursor-pointer text-lg shadow-lg shadow-orange-500/20">
                  Começar a Apostar
                </Button>
              </Link>
              <Link href="/markets">
                <Button variant="outline" size="lg" className="w-full sm:w-auto cursor-pointer text-lg">
                  Ver Mercados
                </Button>
              </Link>
            </div>

            <div className="mt-16 grid grid-cols-3 gap-4 md:gap-8 text-center opacity-80">
              <div>
                <div className="text-3xl md:text-4xl font-bold text-white mb-1">100+</div>
                <div className="text-sm text-slate-500 uppercase tracking-wider">Discussões salvas do Meet</div>
              </div>
              <div>
                <div className="text-3xl md:text-4xl font-bold text-white mb-1">ZERO</div>
                <div className="text-sm text-slate-500 uppercase tracking-wider">Risco financeiro (só emocional)</div>
              </div>
              <div>
                <div className="text-3xl md:text-4xl font-bold text-white mb-1">100%</div>
                <div className="text-sm text-slate-500 uppercase tracking-wider">Probabilidade do chefe não entender a piada</div>
              </div>
            </div>
          </div>
        </section>

        {/* Como Funciona Section */}
        <section id="como-funciona" className="py-20 bg-slate-900 border-t border-slate-800">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-5xl font-bold mb-4">Como funciona o esquema?</h2>
              <p className="text-slate-400 max-w-xl mx-auto">
                Pense na Nossa Betânia como aquela resenha pós-expediente, só que oficializada.
                Em vez de só reclamar, você transforma o caos da firma em mercados de apostas.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              <Card className="hover:border-orange-500/50 transition-colors">
                <div className="w-12 h-12 bg-orange-500/30 rounded-lg flex items-center justify-center mb-4 text-2xl">
                  💰
                </div>
                <h3 className="text-xl font-bold mb-2">1. Receba seu Bônus Corporativo</h3>
                <p className="text-slate-400">
                  Cadastre-se e ganhe <strong className="text-orange-400">100 Armandólars</strong> de
                  graça. É o único bônus da firma que não vem com &quot;meta agressiva&quot; escondida.
                </p>
              </Card>

              <Card className="hover:border-orange-500/50 transition-colors">
                <div className="w-12 h-12 bg-orange-500/30 rounded-lg flex items-center justify-center mb-4 text-2xl">
                  📊
                </div>
                <h3 className="text-xl font-bold mb-2">2. Analise o Caos</h3>
                <p className="text-slate-400">
                  Explore mercados como &quot;Vai acabar a luz hoje?&quot; ou
                  &quot;Seremos ignorados pelo chefe?&quot;. As odds mudam conforme o humor do time e do gestor.
                </p>
              </Card>

              <Card className="hover:border-orange-500/50 transition-colors">
                <div className="w-12 h-12 bg-orange-500/30 rounded-lg flex items-center justify-center mb-4 text-2xl">
                  🏆
                </div>
                <h3 className="text-xl font-bold mb-2">3. Vire Milho-nário da Firma</h3>
                <p className="text-slate-400">
                  Acerte as previsões, suba no ranking e ganhe algo mais raro que aumento:
                  respeito informal no grupo do café.
                </p>
              </Card>
            </div>
          </div>
        </section>
      </main>

      <SiteFooter logoUrl={logoUrl} />
    </div>
  );
}
