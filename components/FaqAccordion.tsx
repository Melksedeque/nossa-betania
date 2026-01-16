'use client';
import { useState } from 'react';

const faqs = [
  { q: "O dinheiro é de verdade?", a: "Não. É tudo fictício. Se você ganhar, ganha honra. Se perder, ganha vergonha. Não aceitamos Pix, nem Boleto, nem Vale-Refeição." },
  { q: "Posso sacar meus ganhos?", a: "Claro! O saque é processado imediatamente em forma de 'tapinha nas costas' e 'parabéns' no grupo da firma." },
  { q: "Quem cria as apostas?", a: "Qualquer usuário cadastrado pode criar uma aposta. Mas cuidado: se ninguém apostar, você vai parecer aquele colega que marca happy hour e ninguém vai." },
  { q: "O que acontece se eu perder tudo?", a: "O sistema te dá um 'Auxílio Emergencial Corporativo' diário para você continuar jogando. A casa nunca deixa você passar fome (de apostas)." },
  { q: "O RH vai ver isso?", a: "Se eles tiverem senso de humor, sim. Se não, diga que é uma plataforma de 'Gamificação de Análise Preditiva de Riscos Corporativos'." },
  { q: "Como subo no ranking?", a: "Ganhando apostas. Simples assim. Sorte no jogo, azar no amor (e no código)." }
];

export function FaqAccordion() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <div className="space-y-4">
      {faqs.map((faq, index) => (
        <div key={index} className="border border-slate-800 rounded-lg bg-slate-900/50 overflow-hidden">
          <button
            onClick={() => setOpenIndex(openIndex === index ? null : index)}
            className="w-full flex items-center justify-between p-4 text-left hover:bg-slate-800/50 transition-colors cursor-pointer"
          >
            <span className="font-medium text-slate-200">{faq.q}</span>
            <span className={`transform transition-transform duration-300 text-orange-500 ${openIndex === index ? 'rotate-180' : ''}`}>
              ▼
            </span>
          </button>
          <div
            className={`transition-all duration-300 ease-in-out overflow-hidden ${
              openIndex === index ? 'max-h-48 opacity-100' : 'max-h-0 opacity-0'
            }`}
          >
            <div className="p-4 pt-0 text-slate-400 text-sm border-t border-slate-800/50 mt-2">
              {faq.a}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
