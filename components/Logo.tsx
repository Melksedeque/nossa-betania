import Link from 'next/link';
import Image from 'next/image';

async function getLogoUrl() {
  try {
    const res = await fetch('/api/system/logo');
    if (!res.ok) return null;
    const data = await res.json();
    return data.logoUrl as string | null;
  } catch (_error) {
    return null;
  }
}

export async function Logo({ className = '' }: { className?: string }) {
  const logoUrl = await getLogoUrl();

  return (
    <Link href="/dashboard" className={`flex items-center gap-2 group ${className}`}>
      {logoUrl ? (
        <div className="relative h-10 w-10 overflow-hidden rounded-lg shadow-lg shadow-orange-500/20 transform group-hover:rotate-12 transition-transform">
          <Image
            src={logoUrl}
            alt="Logo"
            fill
            className="object-cover"
            sizes="40px"
          />
        </div>
      ) : (
        <div className="bg-orange-500 text-white font-black text-xl p-2 rounded-lg transform group-hover:rotate-12 transition-transform shadow-lg shadow-orange-500/20">
          NB
        </div>
      )}
      <span className="text-2xl font-bold text-white tracking-tighter font-barlow">
        Nossa<span className="text-orange-500">Betânia</span>
      </span>
    </Link>
  );
}
