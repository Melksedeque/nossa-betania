
import 'dotenv/config';
import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

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
  const passwordHash = await bcrypt.hash('123456', 10);

  const users = [
    {
      name: 'Gerente de PowerPoint',
      email: 'gerente@nossabetania.com',
      image: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Felix',
      role: 'ADMIN',
      balance: 5000.00, // O rico
    },
    {
      name: 'Estagiário Sobrevivente',
      email: 'estagiario@nossabetania.com',
      image: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Aneka',
      role: 'USER',
      balance: 2.50, // O pobre
    },
    {
      name: 'Dev FullCycle (de Problemas)',
      email: 'dev@nossabetania.com',
      image: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Bob',
      role: 'USER',
      balance: 150.00,
    },
    {
      name: 'RH da Alegria',
      email: 'rh@nossabetania.com',
      image: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Rhianna',
      role: 'USER',
      balance: 800.00,
    }
  ];

  for (const u of users) {
    await prisma.user.create({
      data: {
        ...u,
        password: passwordHash,
      }
    });
  }

  console.log(`👥 ${users.length} usuários criados.`);

  // 3. Criar Mercados (As Apostas do Caos)
  const markets = [
    {
      question: 'A reunião de Alinhamento vai durar quanto tempo?',
      description: 'Aquela "rapidinha" de 15 minutos marcada para as 17h.',
      options: [
        { label: 'Menos de 30min (Milagre)', odds: 15.0 },
        { label: '30min a 1h (Padrão)', odds: 2.0 },
        { label: 'Mais de 1h (Vai virar pizza)', odds: 1.5 },
      ]
    },
    {
      question: 'Quem vai quebrar o Build na sexta-feira?',
      description: 'Façam suas apostas para o culpado do fim de semana perdido.',
      options: [
        { label: 'O Estagiário', odds: 1.2 },
        { label: 'O Tech Lead', odds: 5.0 },
        { label: 'O Cliente (Pediu alteração)', odds: 2.5 },
        { label: 'Ninguém (Fake News)', odds: 50.0 },
      ]
    },
    {
      question: 'Quantas vezes a frase "Sinergia" será dita hoje?',
      description: 'Contagem oficial no Townhall.',
      options: [
        { label: '0 a 2 vezes', odds: 3.0 },
        { label: '3 a 5 vezes', odds: 2.0 },
        { label: 'Mais de 5 (Bingo!)', odds: 1.8 },
      ]
    },
    {
      question: 'O café da copa vai acabar antes das 10h?',
      description: 'A crise da cafeína é real.',
      options: [
        { label: 'Sim (Pânico)', odds: 1.3 },
        { label: 'Não (Tem estoque)', odds: 2.8 },
      ]
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
