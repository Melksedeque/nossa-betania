import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import Image from 'next/image';

export async function Logo({ className = '' }: { className?: string }) {
  let logoUrl = null;

  try {
    const setting = await prisma.systemSetting.findUnique({
      where: { key: 'logo_url' },
    });
    logoUrl = setting?.value;
  } catch (_error) {
    // Fail silently to default
  }

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
