
import 'dotenv/config';
import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '@prisma/client';

const connectionString = process.env.POSTGRES_PRISMA_URL;

const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log('📉 Adicionando o Mercado do PDR (Sem resetar o banco)...');

  await prisma.market.create({
    data: {
      question: 'A Lenda do PDR 2026: Quando sai a definição do salário?',
      description: 'Salário congelado desde Jan/2024. A reunião do dia 13 foi pro dia 20, e hoje... sumiu da agenda misteriosamente. Quando a diretoria vai criar coragem?',
      status: 'OPEN',
      // Expira final de fevereiro pra dar tempo da enrolação acontecer
      expiresAt: new Date('2026-01-20T20:59:59'),
      options: {
        create: [
          { label: 'Amanhã 21/01 (A Esperança do Ingênuo)', odds: 25.0 },
          { label: 'Terça 27/01 (Só mais uma semaninha)', odds: 4.5 },
          { label: 'Começo de Fevereiro (Empurrando com a barriga)', odds: 1.8 },
          { label: 'Mais um ano sem reajuste ("O mercado está difícil")', odds: 1.05 },
        ]
      }
    }
  });

  console.log('✅ Mercado do PDR criado com sucesso! Preparem os lenços.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
