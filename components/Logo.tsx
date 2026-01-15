"use client";

import Link from "next/link";
import Image from "next/image";

interface LogoProps {
  className?: string;
  logoUrl?: string | null;
}

export function Logo({ className = "", logoUrl }: LogoProps) {
  return (
    <Link href="/dashboard" className={`flex items-center gap-2 group ${className}`}>
      {logoUrl ? (
        <div className="relative h-12 w-12 overflow-hidden rounded-lg shadow-lg shadow-orange-500/20 transform group-hover:rotate-12 transition-transform">
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
      <span className="flex flex-col tracking-wide">
        <span className="text-2xl font-bold text-white font-barlow">
          Nossa<span className="text-orange-500">Bet</span>ânia
        </span>
        <span className="text-sm text-slate-200 font-inter font-light">
          Onde seu estresse real vira lucro fictício!
          </span>
      </span>
    </Link>
  );
}
