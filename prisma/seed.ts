
import 'dotenv/config';
import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import { readFileSync } from 'fs';
import path from 'path';

const connectionString = process.env.POSTGRES_PRISMA_URL;

const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });



async function main() {
  console.log('🌱 Iniciando a plantação do Caos Corporativo...');

  // 1. Limpeza (Opcional: descomente para limpar tudo antes de criar)
  // Isso garante que não teremos dados duplicados se rodar o seed várias vezes
  // CUIDADO: Isso apaga TODOS os dados do banco!
  await prisma.bet.deleteMany();
  await prisma.option.deleteMany();
  await prisma.market.deleteMany();
  await prisma.session.deleteMany();
  await prisma.account.deleteMany();
  await prisma.user.deleteMany();

  console.log('🧹 Casa limpa (Dados antigos removidos).');

  // 2. Criar Usuários (O Elenco do Escritório)
  const defaultPasswordHash = await bcrypt.hash('123456', 10);
  const adminPasswordHash = await bcrypt.hash('km25@vX3!', 10);

  // Admins fixos
  const adminUsers = [
    {
      name: 'Dono da Banca',
      email: 'freelancer@melksedeque.com.br',
      image: 'https://api.dicebear.com/7.x/avataaars/svg?seed=AdminBoss',
      role: 'ADMIN',
      balance: 10000.0,
      passwordHash: adminPasswordHash,
      bio: 'O verdadeiro chefe do caos corporativo.',
      situation: 'ATIVO',
    },
  ];

  for (const admin of adminUsers) {
    await prisma.user.create({
      data: {
        name: admin.name,
        email: admin.email,
        image: admin.image,
        role: admin.role,
        balance: admin.balance,
        password: admin.passwordHash,
        bio: admin.bio,
        situation: admin.situation,
      },
    });
  }

  // Usuários fictícios do elenco (arquivo JSON)
  const usersJsonPath = path.join(__dirname, '..', 'Referencias', 'usuarios.json');
  const raw = readFileSync(usersJsonPath, 'utf-8');
  const jsonUsersRaw = JSON.parse(raw) as Array<{
    name: string;
    email: string;
    password: string;
    role?: string;
    balance?: number;
    bio?: string;
    image?: string;
    situation?: string;
  }>;

  // Deduplicar por email – última ocorrência ganha
  const byEmail = new Map<string, (typeof jsonUsersRaw)[number]>();
  for (const u of jsonUsersRaw) {
    if (u.email) {
      byEmail.set(u.email, u);
    }
  }
  const jsonUsers = Array.from(byEmail.values());

  for (const u of jsonUsers) {
    const passwordHash = await bcrypt.hash(u.password || '123456', 10);
    const avatarSeed = encodeURIComponent(u.name || u.email);
    const image = `https://api.dicebear.com/7.x/avataaars/svg?seed=${avatarSeed}`;

    await prisma.user.create({
      data: {
        name: u.name,
        email: u.email,
        password: passwordHash,
        image,
        role: u.role ?? 'USER',
        balance: u.balance ?? 100.0,
        bio: u.bio ?? null,
        situation: u.situation ?? 'ATIVO',
      },
    });
  }

  console.log(`👥 ${adminUsers.length + jsonUsers.length} usuários criados.`);

  // 3. Criar Mercados (As Apostas do Caos)
  const markets = [
  {
    question: 'Quantas vezes o Chefe vai usar a palavra "Extraordinário" na reunião?',
    description: 'A palavra mágica que faz o faturamento cair e o ego subir.',
    options: [
      { label: 'De 0 a 5 vezes', odds: 5.0 },
      { label: 'De 6 a 15 vezes', odds: 2.0 },
      { label: 'Mais de 15 vezes (Overdose)', odds: 1.2 },
    ],
    // Expira Segunda às 18h
    expiresAt: new Date('2026-01-19T18:00:00'),
  },
  {
    question: 'O "Mago do Prompt" vai terminar o sistema sozinho ou pedir socorro?',
    description: 'Prometeu o novo Whatsapp em 3 dias usando IA. Veremos.',
    options: [
      { label: 'Termina sozinho (Milagre)', odds: 80.0 },
      { label: 'Pede socorro pro Dev do Caos', odds: 1.1 },
      { label: 'Diz que a IA "está fora do ar"', odds: 3.5 },
    ],
    // Expira Quarta às 12h
    expiresAt: new Date('2026-01-21T12:00:00'),
  },
  {
    question: 'Horário de entrada do "Desenvolvedor do Caos" na Daily',
    description: 'O despertador é apenas uma sugestão meramente ilustrativa.',
    options: [
      { label: 'Antes do "Bom dia"', odds: 10.0 },
      { label: 'Durante a pauta do Marketing', odds: 2.0 },
      { label: 'Entra mudo e sai calado no final', odds: 1.5 },
    ],
    // Expira Segunda às 09:15
    expiresAt: new Date('2026-01-19T09:15:00'),
  },
  {
    question: 'O "Shape de Compras" vai responder o chamado antes do treino?',
    description: 'A academia abre às 14h, o cronômetro está rodando.',
    options: [
      { label: 'Responde em 5 min', odds: 25.0 },
      { label: 'Só visualiza e foge', odds: 1.8 },
      { label: 'Culpa os meninos da TI', odds: 1.2 },
    ],
    // Expira Terça às 14:00
    expiresAt: new Date('2026-01-20T14:00:00'),
  },
  {
    question: 'Qual será o primeiro aviso da "Anônima do RH" na semana?',
    description: 'Aquele clima de "somos uma família" com um toque de medo.',
    options: [
      { label: '"A pesquisa é anônima"', odds: 1.5 },
      { label: '"Sem feedback de aumento hoje"', odds: 2.5 },
      { label: '"Alguém esqueceu a marmita no microondas"', odds: 5.0 },
    ],
    // Expira Segunda às 10:00
    expiresAt: new Date('2026-01-19T10:00:00'),
  },
  {
    question: 'Quantos "Eu avisei" a Dra. Dináh vai soltar sobre o novo processo?',
    description: 'O Jurídico já está com o processo no rascunho do Gmail.',
    options: [
      { label: 'Nenhum (Ela desistiu de nós)', odds: 10.0 },
      { label: 'Exatamente 1', odds: 2.0 },
      { label: 'Vai mandar o link do CLT no Slack', odds: 1.3 },
    ],
    // Expira Quinta às 17:00
    expiresAt: new Date('2026-01-22T17:00:00'),
  },
  {
    question: 'A "Herdeira do Nada" vai aparecer em qual reunião?',
    description: 'Ação ativa ou descanso passivo?',
    options: [
      { label: 'Na de Planejamento', odds: 15.0 },
      { label: 'Na de Resultados (Pra bater palma)', odds: 3.0 },
      { label: 'Em todas para planejar a "Ação Ativa"', odds: 1.1 },
    ],
    // Expira Sexta às 16:00
    expiresAt: new Date('2026-01-23T16:00:00'),
  },
  {
    question: 'O próximo trocadilho do "Marketeiro" vai fazer alguém chorar?',
    description: 'Nível de "tiozão do pavê" detectado nas planilhas.',
    options: [
      { label: 'Risada forçada (Padrão)', odds: 1.2 },
      { label: 'Silêncio constrangedor no Meet', odds: 2.0 },
      { label: 'Alguém vai mutar o fone de ódio', odds: 4.0 },
    ],
    // Expira Quarta às 15:00
    expiresAt: new Date('2026-01-21T15:00:00'),
  },
  {
    question: 'Recorde da "Vendedora": Quanto tempo dura a reunião de ajuste salarial?',
    description: 'A conversa que o chefe foge mais que o diabo da cruz.',
    options: [
      { label: 'Nem vai acontecer', odds: 1.05 },
      { label: '5 min (O famoso "vamos ver")', odds: 2.5 },
      { label: 'Mais de 30 min (Promessa de bônus)', odds: 10.0 },
    ],
    // Expira Sexta às 18:00
    expiresAt: new Date('2026-01-23T18:00:00'),
  },
  {
    question: 'Status do Lead da "Rainha das Vendas"',
    description: 'A culpa é sempre do SDR que já saiu.',
    options: [
      { label: 'Lead Gelado (Antártida)', odds: 1.4 },
      { label: 'Lead Morno (Dá pra tentar)', odds: 3.0 },
      { label: 'Lead Quente (Sumiu o contato)', odds: 6.0 },
    ],
    // Expira Terça às 11:00
    expiresAt: new Date('2026-01-20T11:00:00'),
  },
  {
    question: 'Bolão do Apocalipse: Quando sai o pedido de Recuperação Judicial?',
    description: 'Façam suas apostas antes que o oficial de justiça leve a máquina de café.',
    options: [
      { label: '1º Sem 2026 (Otimismo Tóxico)', odds: 15.0 },
      { label: '2º Sem 2026 (Pós-Festa da Firma)', odds: 5.0 },
      { label: '1º Sem 2027 (Acabou o Runway)', odds: 1.8 },
      { label: '2º Sem 2027 (A Profecia se Cumpre)', odds: 1.2 },
      { label: 'Nunca (Lavagem de Dinheiro?)', odds: 50.0 },
    ],
    // Expira no final de Fevereiro (aproveite enquanto dura)
    expiresAt: new Date('2026-02-28T23:59:59'),
  }
];

  for (const m of markets) {
    await prisma.market.create({
      data: {
        question: m.question,
        description: m.description,
        status: 'OPEN',
        options: {
          create: m.options
        }
      }
    });
  }

  console.log(`🎲 ${markets.length} mercados de aposta criados.`);
  console.log('✅ Seed concluído com sucesso! O Caos está instaurado.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
