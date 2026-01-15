import 'dotenv/config';
import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const connectionString = process.env.POSTGRES_PRISMA_URL;

const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function ensureAdmin() {
  const adminEmail = 'freelancer@melksedeque.com.br';

  let admin = await prisma.user.findUnique({ where: { email: adminEmail } });

  if (!admin) {
    const passwordHash = await bcrypt.hash('km25@vX3!', 10);

    admin = await prisma.user.create({
      data: {
        name: 'Dono da Banca',
        email: adminEmail,
        image: 'https://api.dicebear.com/7.x/avataaars/svg?seed=AdminBoss',
        role: 'ADMIN',
        balance: 10000.0,
        password: passwordHash,
      },
    });
  }

  return admin;
}

async function main() {
  console.log('🚨 Iniciando Fase 1: Tabula Rasa (limpeza de dados)...');

  const admin = await ensureAdmin();

  console.log('Admin preservado:', admin.email);

  await prisma.bet.deleteMany({});
  await prisma.comment.deleteMany({});
  await prisma.option.deleteMany({});
  await prisma.market.deleteMany({});

  await prisma.session.deleteMany({
    where: { userId: { not: admin.id } },
  });

  await prisma.account.deleteMany({
    where: { userId: { not: admin.id } },
  });

  await prisma.user.deleteMany({
    where: { id: { not: admin.id } },
  });

  const usersCount = await prisma.user.count();
  const marketsCount = await prisma.market.count();
  const betsCount = await prisma.bet.count();

  console.log('Resumo após Tabula Rasa:');
  console.log('Usuários:', usersCount);
  console.log('Mercados:', marketsCount);
  console.log('Apostas:', betsCount);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

