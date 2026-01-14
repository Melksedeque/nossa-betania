'use server';

import { signIn } from '@/auth';
import { AuthError } from 'next-auth';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';
import { z } from 'zod';
import { revalidatePath } from 'next/cache';

const RegisterSchema = z.object({
  name: z.string().min(2, { message: 'Nome deve ter pelo menos 2 caracteres.' }),
  email: z.string().email({ message: 'Email inválido.' }),
  password: z.string().min(6, { message: 'A senha deve ter pelo menos 6 caracteres.' }),
});

export async function authenticate(
  prevState: string | undefined,
  formData: FormData,
) {
  try {
    await signIn('credentials', {
      ...Object.fromEntries(formData),
      redirectTo: '/dashboard',
    });
  } catch (error) {
    if (error instanceof AuthError) {
      console.error('AuthError:', error.type, error.message);
      switch (error.type) {
        case 'CredentialsSignin':
          return 'Credenciais inválidas.';
        case 'CallbackRouteError':
          return 'Erro de conexão ou configuração. Tente novamente.';
        default:
          return `Algo deu errado. (${error.type})`;
      }
    }
    throw error;
  }
}

export async function register(
  prevState: string | undefined,
  formData: FormData,
) {
  const validatedFields = RegisterSchema.safeParse({
    name: formData.get('name'),
    email: formData.get('email'),
    password: formData.get('password'),
  });

  if (!validatedFields.success) {
    return 'Campos inválidos. Verifique os dados e tente novamente.';
  }

  const { name, email, password } = validatedFields.data;

  try {
    // Verificar se o usuário já existe
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return 'Este email já está cadastrado.';
    }

    // Hash da senha
    const hashedPassword = await bcrypt.hash(password, 10);

    // Criar usuário com saldo inicial de 100 Armandólars
    await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        balance: 100.0,
      },
    });

    // Após registrar, não logamos automaticamente, mas retornamos sucesso
    // O usuário será redirecionado para login no componente client-side ou aqui
    return 'Conta criada com sucesso! Faça login.';
  } catch (error) {
    console.error('Registration error:', error);
    return 'Erro ao criar conta. Tente novamente mais tarde.';
  }
}

export async function placeBet(
  userId: string,
  optionId: string,
  amount: number
) {
  try {
    if (amount <= 0) {
      return { success: false, message: 'O valor da aposta deve ser maior que zero.' };
    }

    // 1. Verificar saldo do usuário
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { balance: true },
    });

    if (!user) {
      return { success: false, message: 'Usuário não encontrado.' };
    }

    if (user.balance < amount) {
      return { success: false, message: 'Saldo insuficiente para esta aposta.' };
    }

    // 2. Verificar se o mercado está aberto (opcional, mas recomendado)
    const option = await prisma.option.findUnique({
      where: { id: optionId },
      include: { market: true },
    });

    if (!option || option.market.status !== 'OPEN') {
      return { success: false, message: 'Este mercado não está aceitando apostas.' };
    }

    // 3. Realizar a transação (Debitar saldo + Criar aposta)
    await prisma.$transaction([
      prisma.user.update({
        where: { id: userId },
        data: { balance: { decrement: amount } },
      }),
      prisma.bet.create({
        data: {
          userId,
          optionId,
          amount,
          status: 'PENDING',
        },
      }),
    ]);

    revalidatePath('/dashboard');
    return { success: true, message: 'Aposta realizada com sucesso! Boa sorte.' };
  } catch (error) {
    console.error('Place bet error:', error);
    return { success: false, message: 'Erro ao processar a aposta. Tente novamente.' };
  }
}

export async function createMarket(
  question: string,
  description: string,
  expiresAtString: string,
  creatorId: string
) {
  try {
    const expiresAt = new Date(expiresAtString);

    if (!question || question.length < 5) {
      return { success: false, message: 'A pergunta deve ter pelo menos 5 caracteres.' };
    }

    if (isNaN(expiresAt.getTime()) || expiresAt <= new Date()) {
      return { success: false, message: 'A data de encerramento deve ser no futuro.' };
    }

    const market = await prisma.market.create({
      data: {
        question,
        description,
        expiresAt,
        creatorId,
        status: 'OPEN',
        options: {
          create: [
            { label: 'Sim', odds: 2.0 },
            { label: 'Não', odds: 2.0 },
          ],
        },
      },
    });

    revalidatePath('/dashboard');
    return { success: true, message: 'Aposta criada com sucesso!', marketId: market.id };
  } catch (error) {
    console.error('Create market error:', error);
    return { success: false, message: 'Erro ao criar a aposta. Tente novamente.' };
  }
}

export async function resolveMarket(
  marketId: string,
  winningOptionId: string,
  userId: string
) {
  try {
    // 1. Verificar permissão (apenas o criador ou admin pode resolver)
    const market = await prisma.market.findUnique({
      where: { id: marketId },
      include: { options: true },
    });

    if (!market) {
      return { success: false, message: 'Mercado não encontrado.' };
    }

    if (market.creatorId !== userId) {
      // TODO: Verificar se é Admin também
      return { success: false, message: 'Apenas o criador pode encerrar esta aposta.' };
    }

    if (market.status === 'SETTLED') {
      return { success: false, message: 'Esta aposta já foi encerrada.' };
    }

    const winningOption = market.options.find(o => o.id === winningOptionId);
    if (!winningOption) {
      return { success: false, message: 'Opção inválida.' };
    }

    // 2. Encontrar todas as apostas vencedoras
    const winningBets = await prisma.bet.findMany({
      where: {
        optionId: winningOptionId,
        status: 'PENDING',
      },
    });

    // 3. Processar pagamentos e atualizações em transação
    await prisma.$transaction(async (tx) => {
      // Atualizar status do mercado
      await tx.market.update({
        where: { id: marketId },
        data: {
          status: 'SETTLED',
          outcomeId: winningOptionId,
        },
      });

      // Atualizar apostas vencedoras para WON
      await tx.bet.updateMany({
        where: { optionId: winningOptionId },
        data: { status: 'WON' },
      });

      // Atualizar apostas perdedoras para LOST (todas deste mercado que não são a vencedora)
      // Como updateMany não suporta join, fazemos via optionId
      const losingOptionIds = market.options
        .filter(o => o.id !== winningOptionId)
        .map(o => o.id);

      await tx.bet.updateMany({
        where: {
          optionId: { in: losingOptionIds },
          status: 'PENDING',
        },
        data: { status: 'LOST' },
      });

      // Pagar os vencedores
      for (const bet of winningBets) {
        const payout = bet.amount * winningOption.odds;
        await tx.user.update({
          where: { id: bet.userId },
          data: { balance: { increment: payout } },
        });
      }
    });

    revalidatePath('/dashboard');
    return { success: true, message: 'Aposta encerrada e pagamentos realizados!' };
  } catch (error) {
    console.error('Resolve market error:', error);
    return { success: false, message: 'Erro ao resolver a aposta.' };
  }
}

export async function mendigarRecarga(userId: string) {
  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) return { success: false, message: 'Usuário não encontrado.' };

    if (user.balance >= 10) {
      return { success: false, message: 'Você ainda tem dinheiro! Só aceitamos mendigos reais (saldo < 10).' };
    }

    await prisma.user.update({
      where: { id: userId },
      data: { balance: { increment: 100 } },
    });

    revalidatePath('/dashboard');
    return { success: true, message: 'Recarga de emergência recebida! Gaste com sabedoria.' };
  } catch (error) {
    console.error('Mendigar error:', error);
    return { success: false, message: 'O banco está fechado. Tente novamente.' };
  }
}
