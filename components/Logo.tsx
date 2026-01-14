import Link from 'next/link';

export function Logo({ className = '' }: { className?: string }) {
  return (
    <Link href="/dashboard" className={`flex items-center gap-2 group ${className}`}>
      <div className="bg-orange-500 text-white font-black text-xl p-2 rounded-lg transform group-hover:rotate-12 transition-transform shadow-lg shadow-orange-500/20">
        NB
      </div>
      <span className="text-2xl font-bold text-white tracking-tighter font-barlow">
        Nossa<span className="text-orange-500">Betânia</span>
      </span>
    </Link>
  );
}
