import Link from 'next/link';
import { Logo } from './Logo';
import { Button } from './Button';

interface SiteHeaderProps {
  isLoggedIn: boolean;
  logoUrl?: string | null;
}

export function SiteHeader({ isLoggedIn, logoUrl }: SiteHeaderProps) {
  return (
    <header className="border-b border-slate-800 bg-slate-950/70 backdrop-blur-sm sticky top-0 z-40">
      <div className="container mx-auto px-4 h-20 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Logo className="shrink-0" logoUrl={logoUrl} href="/" />
        </div>
        <nav className="hidden md:flex gap-6 text-md font-medium text-slate-300">
          <Link href="/#como-funciona" className="group relative hover:text-orange-500 transition-colors py-1">
            Como Funciona
            <span className="absolute left-0 bottom-0 w-full h-0.5 bg-orange-500 scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-300 ease-out" />
          </Link>
          <Link href="/manifesto" className="group relative hover:text-orange-500 transition-colors py-1">
            Manifesto
            <span className="absolute left-0 bottom-0 w-full h-0.5 bg-orange-500 scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-300 ease-out" />
          </Link>
          <Link href="/markets" className="group relative hover:text-orange-500 transition-colors py-1">
            Mercados Abertos
            <span className="absolute left-0 bottom-0 w-full h-0.5 bg-orange-500 scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-300 ease-out" />
          </Link>
          <Link href="/elenco" className="group relative hover:text-orange-500 transition-colors py-1">
            Elenco
            <span className="absolute left-0 bottom-0 w-full h-0.5 bg-orange-500 scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-300 ease-out" />
          </Link>
          <Link href="/faqs" className="group relative hover:text-orange-500 transition-colors py-1">
            FAQs
            <span className="absolute left-0 bottom-0 w-full h-0.5 bg-orange-500 scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-300 ease-out" />
          </Link>
          <Link href="/contato" className="group relative hover:text-orange-500 transition-colors py-1">
            Contato
            <span className="absolute left-0 bottom-0 w-full h-0.5 bg-orange-500 scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-300 ease-out" />
          </Link>
        </nav>
        <div className="flex gap-4">
          <Link href={isLoggedIn ? '/dashboard' : '/login'}>
            <Button variant="ghost" size="md" className="cursor-pointer">
              {isLoggedIn ? 'Voltar ao Jogo' : 'Entrar'}
            </Button>
          </Link>
          <Link href="/register">
            <Button size="md" className="cursor-pointer">Criar Conta</Button>
          </Link>
        </div>
      </div>
    </header>
  );
}
