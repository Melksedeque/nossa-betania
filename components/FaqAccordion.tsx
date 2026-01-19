'use client';
import { useState } from 'react';

const faqs = [
  { 
    q: "O dinheiro é de verdade?", 
    a: "Não, aqui trabalhamos com Armandólars ($AMD). É uma moeda lastreada em promessas de aumento, café frio e horas extras não pagas. Se você ganhar, acumula prestígio fictício. Se perder, é só mais uma terça-feira no escritório." 
  },
  { 
    q: "Posso sacar meus ganhos via Pix?", 
    a: "O saque é processado imediatamente em forma de 'Senso de Superioridade' sobre os colegas que apostaram errado. Não paga boleto, mas massageia o ego que é uma beleza." 
  },
  { 
    q: "Quem define as odds (cotações)?", 
    a: "Um algoritmo avançado que mistura Inteligência Artificial com a 'Rádio Peão'. Se todo mundo acha que o chefe vai atrasar, a odd cai. É a lei da oferta, da procura e da fofoca." 
  },
  { 
    q: "O que é o tal do 'Elenco'?", 
    a: "É o nosso arquivo confidencial aberto. Lá você vê quem ainda está Ativo (tankando o corporativo diariamente) e quem foi Exilado (pediu as contas ou 'foi convidado a buscar novos desafios'). Se sua Bio for boa, você vira personagem." 
  },
  { 
    q: "O RH vai ver isso?", 
    a: "Se eles tiverem senso de humor, vão rir. Se não tiverem, diga que você está testando uma plataforma de 'Gamificação de Análise Preditiva de Riscos e Engajamento de Stakeholders'. Eles adoram essas palavras-chave no LinkedIn." 
  },
  { 
    q: "Perdi tudo. Vou ser demitido?", 
    a: "Relaxa. Diferente do seu salário que acaba no dia 15, aqui a casa te dá um 'Auxílio Emergencial do Caos' se seu saldo zerar. O objetivo é manter você viciado na adrenalina da derrota iminente." 
  },
  { 
    q: "Como viro 'Milho-nário' da firma?", 
    a: "Acertando previsões impossíveis (tipo 'Reunião acabando no horário' ou 'Cliente aprovando de primeira'). Suba no Ranking, ganhe medalhas virtuais e torne-se uma lenda urbana nos canais do Slack." 
  }
];

export function FaqAccordion() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <div className="space-y-4">
      {faqs.map((faq, index) => (
        <div key={index} className="border border-slate-800 rounded-lg bg-slate-900/50 overflow-hidden">
          <button
            onClick={() => setOpenIndex(openIndex === index ? null : index)}
            className="w-full flex items-center justify-between p-4 text-left hover:bg-slate-800/50 transition-colors cursor-pointer text-xl"
          >
            <span className="font-medium text-slate-200">{faq.q}</span>
            <span className={`transform transition-transform duration-300 text-orange-500 ${openIndex === index ? 'rotate-180' : ''}`}>
              ▼
            </span>
          </button>
          <div
            className={`transition-all duration-300 ease-in-out overflow-hidden ${
              openIndex === index ? 'max-h-60 opacity-100' : 'max-h-0 opacity-0'
            }`}
          >
            <div className="p-4 text-slate-400 text-md border-t border-slate-800/50 leading-relaxed">
              {faq.a}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
