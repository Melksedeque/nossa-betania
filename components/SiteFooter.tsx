import { Logo } from './Logo';

interface SiteFooterProps {
  logoUrl?: string | null;
}

export function SiteFooter({ logoUrl }: SiteFooterProps) {
  const logoHref = '/';

  return (
    <footer className="bg-slate-950 py-12 border-t border-slate-800">
      <div className="container mx-auto px-4 text-center flex flex-col items-center">
        <div className="mb-4">
          <Logo className="shrink-0" logoUrl={logoUrl} href={logoHref} />
        </div>
        <p className="text-slate-500 text-sm max-w-md mx-auto mb-2">
          Aviso Legal: Este site é uma paródia. Não há envolvimento de dinheiro real.
          Os Armandólars não têm valor comercial e não podem ser trocados por coxinha na cantina.
        </p>
        <p className="text-slate-500 text-sm max-w-md mx-auto mb-8">
          Aposte com responsabilidade (e não deixe seu chefe ver).
        </p>
        <div className="text-slate-600 text-xs">
          &copy; {new Date().getFullYear()} Nossa Betânia. Desenvolvido na base do ódio e da cafeína.
        </div>
      </div>
    </footer>
  );
}

