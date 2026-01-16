import { Trophy } from 'lucide-react';
import Image from 'next/image';

interface User {
  id: string;
  name: string | null;
  image: string | null;
  balance: number | null;
}

interface HallOfFameProps {
  users: User[];
}

export function HallOfFame({ users }: HallOfFameProps) {
  if (users.length < 3) return null; // Need at least 3 for the podium

  const [first, second, third, ...mentions] = users;

  return (
    <section className="py-16 relative">
       <div className="text-center mb-20">
          <h2 className="text-3xl md:text-5xl font-bold text-white mb-2 flex items-center justify-center gap-2">
            <span className="text-orange-500 text-3xl"><Trophy /></span> Hall da <span className='text-orange-500'>Fama</span> <span className="text-orange-500 text-3xl"><Trophy /></span>
          </h2>
          <p className="text-slate-400">Os maiores acumuladores de Armandólars fictícios. Lendas do caos corporativo.</p>
       </div>

       <div className="max-w-4xl mx-auto px-4">
          {/* Podium */}
          <div className="flex flex-col md:flex-row items-end justify-center gap-4 mb-12">
             {/* 2nd Place */}
             <div className="order-2 md:order-1 flex-1 w-full bg-slate-800/50 border border-slate-700 rounded-lg p-6 flex flex-col items-center text-center transform hover:scale-105 transition-transform duration-300 relative mt-8 md:mt-0">
               <div className="absolute -top-4 text-3xl z-10">🥈</div>
               <div className="absolute top-0 h-1 rounded-t-xl w-full bg-linear-to-r from-gray-400 via-gray-500 to-gray-400"></div>
               <div className="w-20 h-20 rounded-full border-2 border-slate-600 mb-3 overflow-hidden relative bg-slate-700">
                   {second.image ? <Image src={second.image} alt={second.name || 'User'} fill className="object-cover" /> : <div className="w-full h-full flex items-center justify-center text-xl font-bold text-white">{second.name?.[0]}</div>}
               </div>
               <div className="font-bold text-white mb-1 truncate w-full">{second.name}</div>
               <div className="text-sm text-orange-400 font-mono font-bold">A$ {(second.balance ?? 0).toFixed(0)}</div>
             </div>

             {/* 1st Place */}
             <div className="order-1 md:order-2 flex-1 w-full md:w-auto bg-linear-to-b from-slate-800 to-slate-900 border-2 border-orange-500/50 shadow-[0_0_30px_rgba(249,115,22,0.15)] rounded-lg p-8 flex flex-col items-center text-center transform scale-110 z-10 relative">
               <div className="absolute -top-6 text-5xl z-10 animate-bounce">👑</div>
               <div className="absolute top-0 h-1.5 rounded-t-xl w-full bg-linear-to-r from-yellow-500 via-amber-500 to-yellow-500"></div>
               <div className="w-24 h-24 rounded-full border-4 border-orange-500 mb-4 overflow-hidden relative bg-slate-700">
                   {first.image ? <Image src={first.image} alt={first.name || 'User'} fill className="object-cover" /> : <div className="w-full h-full flex items-center justify-center text-2xl font-bold text-white">{first.name?.[0]}</div>}
               </div>
               <div className="font-bold text-xl text-white mb-1 truncate w-full">{first.name}</div>
               <div className="text-lg text-orange-500 font-mono font-bold">A$ {(first.balance ?? 0).toFixed(0)}</div>
             </div>

             {/* 3rd Place */}
             <div className="order-3 flex-1 w-full bg-slate-800/50 border border-slate-700 rounded-lg p-6 flex flex-col items-center text-center transform hover:scale-105 transition-transform duration-300 relative">
               <div className="absolute -top-4 text-3xl z-10">🥉</div>
               <div className="absolute top-0 h-1 rounded-t-xl w-full bg-linear-to-r from-orange-800 via-orange-900 to-orange-800"></div>
               <div className="w-20 h-20 rounded-full border-2 border-slate-600 mb-3 overflow-hidden relative bg-slate-700">
                   {third.image ? <Image src={third.image} alt={third.name || 'User'} fill className="object-cover" /> : <div className="w-full h-full flex items-center justify-center text-xl font-bold text-white">{third.name?.[0]}</div>}
               </div>
               <div className="font-bold text-white mb-1 truncate w-full">{third.name}</div>
               <div className="text-sm text-orange-400 font-mono font-bold">A$ {(third.balance ?? 0).toFixed(0)}</div>
             </div>
          </div>

          {/* Honorable Mentions */}
          {mentions.length > 0 && (
            <div className="bg-slate-900/50 border border-slate-800 rounded-2xl mt-20 mb-12 p-6">
               <h3 className="text-center text-sm font-semibold text-slate-400 uppercase tracking-wider mb-6">Menções Honrosas</h3>
               <div className="flex flex-wrap justify-center gap-8 md:gap-12">
                  {mentions.map((user) => (
                    <div key={user.id} className="flex items-center gap-3">
                       <div className="w-10 h-10 rounded-full bg-slate-800 border border-slate-700 overflow-hidden relative">
                          {user.image ? <Image src={user.image} alt={user.name || 'User'} fill className="object-cover" /> : <div className="w-full h-full flex items-center justify-center text-xs font-bold text-white">{user.name?.[0]}</div>}
                       </div>
                       <div className="text-left">
                          <div className="text-sm font-medium text-slate-300 max-w-[120px] truncate">{user.name}</div>
                          <div className="text-xs text-orange-500 font-mono">A$ {(user.balance ?? 0).toFixed(0)}</div>
                       </div>
                    </div>
                  ))}
               </div>
            </div>
          )}
       </div>
    </section>
  );
}
