import Link from "next/link";
import { Button } from "@/components/Button";
import { Card } from "@/components/Card";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Header / Navbar */}
      <header className="border-b border-slate-800 bg-slate-900/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-2xl font-bold text-orange-500 uppercase tracking-tighter">
              Nossa Betânia
            </span>
          </div>
          <nav className="hidden md:flex gap-6 text-sm font-medium text-slate-300">
            <Link href="#como-funciona" className="hover:text-orange-500 transition-colors">
              Como Funciona
            </Link>
            <Link href="#mercados" className="hover:text-orange-500 transition-colors">
              Mercados Abertos
            </Link>
            <Link href="#sobre" className="hover:text-orange-500 transition-colors">
              Manifesto
            </Link>
          </nav>
          <div className="flex gap-4">
            <Link href="/login">
              <Button variant="ghost" size="sm">Entrar</Button>
            </Link>
            <Link href="/register">
              <Button size="sm">Criar Conta</Button>
            </Link>
          </div>
        </div>
      </header>

      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative py-20 md:py-32 overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-orange-900/20 via-slate-900 to-slate-900 z-0" />
          
          <div className="container mx-auto px-4 relative z-10 text-center max-w-4xl">
            <div className="inline-block px-3 py-1 mb-6 rounded-full bg-orange-500/10 border border-orange-500/20 text-orange-400 text-sm font-medium animate-pulse">
              🚀 A Reunião de Segunda foi adiada? Lucre com isso!
            </div>
            
            <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight tracking-tight">
              A Primeira Casa de Apostas focada no <span className="text-orange-500">Caos Corporativo</span>.
            </h1>
            
            <p className="text-lg md:text-xl text-slate-400 mb-10 max-w-2xl mx-auto leading-relaxed">
              Transforme o estresse do dia a dia em lucro (fictício). Aposte se o deploy vai quebrar, se o chefe vai atrasar ou se o café vai acabar antes do meio-dia.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/register">
                <Button size="lg" className="w-full sm:w-auto text-lg shadow-lg shadow-orange-500/20">
                  Começar a Apostar
                </Button>
              </Link>
              <Link href="/markets">
                <Button variant="outline" size="lg" className="w-full sm:w-auto text-lg">
                  Ver Mercados
                </Button>
              </Link>
            </div>

            <div className="mt-16 grid grid-cols-3 gap-4 md:gap-8 text-center opacity-80">
              <div>
                <div className="text-3xl md:text-4xl font-bold text-white mb-1">100+</div>
                <div className="text-sm text-slate-500 uppercase tracking-wider">Apostas Diárias</div>
              </div>
              <div>
                <div className="text-3xl md:text-4xl font-bold text-white mb-1">ZERO</div>
                <div className="text-sm text-slate-500 uppercase tracking-wider">Dinheiro Real</div>
              </div>
              <div>
                <div className="text-3xl md:text-4xl font-bold text-white mb-1">100%</div>
                <div className="text-sm text-slate-500 uppercase tracking-wider">Diversão</div>
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
                É simples. Não usamos dinheiro de verdade, usamos Armandólars. O objetivo é ver quem tem a melhor leitura do ambiente de trabalho.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              <Card className="hover:border-orange-500/50 transition-colors">
                <div className="w-12 h-12 bg-orange-500/10 rounded-lg flex items-center justify-center mb-4 text-2xl">
                  💰
                </div>
                <h3 className="text-xl font-bold mb-2">1. Receba seu Bônus</h3>
                <p className="text-slate-400">
                  Cadastre-se e ganhe automaticamente <strong className="text-orange-400">100 Armandólars</strong> para começar a banca. Sem pegadinhas.
                </p>
              </Card>

              <Card className="hover:border-orange-500/50 transition-colors">
                <div className="w-12 h-12 bg-orange-500/10 rounded-lg flex items-center justify-center mb-4 text-2xl">
                  📊
                </div>
                <h3 className="text-xl font-bold mb-2">2. Analise o Cenário</h3>
                <p className="text-slate-400">
                  Confira os mercados abertos. "O ar condicionado vai quebrar hoje?" ou "Fulano vai trazer marmita?". As odds mudam em tempo real.
                </p>
              </Card>

              <Card className="hover:border-orange-500/50 transition-colors">
                <div className="w-12 h-12 bg-orange-500/10 rounded-lg flex items-center justify-center mb-4 text-2xl">
                  🏆
                </div>
                <h3 className="text-xl font-bold mb-2">3. Vire Milho-nário</h3>
                <p className="text-slate-400">
                  Acerte as previsões, multiplique seus Armandólars e suba no ranking global da firma. Quem sabe você não ganha um aumento (de ego)?
                </p>
              </Card>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-slate-950 py-12 border-t border-slate-800">
        <div className="container mx-auto px-4 text-center">
          <div className="text-2xl font-bold text-slate-700 uppercase tracking-tighter mb-4">
            Nossa Betânia
          </div>
          <p className="text-slate-500 text-sm max-w-md mx-auto mb-8">
            Aviso Legal: Este site é uma paródia. Não há envolvimento de dinheiro real. 
            Os Armandólars não têm valor comercial e não podem ser trocados por coxinha na cantina.
            Aposte com responsabilidade (e não deixe seu chefe ver).
          </p>
          <div className="text-slate-600 text-xs">
            &copy; {new Date().getFullYear()} Nossa Betânia. Desenvolvido com ódio e cafeína.
          </div>
        </div>
      </footer>
    </div>
  );
}
