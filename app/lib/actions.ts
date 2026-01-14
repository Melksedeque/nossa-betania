'use server';

import { signIn } from '@/auth';
import { AuthError } from 'next-auth';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';
import { z } from 'zod';

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

    // Revalidar o dashboard para atualizar saldo e dados
    // revalidatePath('/dashboard'); // Importar revalidatePath de 'next/cache' se necessário, mas aqui retornamos sucesso para o client atualizar

    return { success: true, message: 'Aposta realizada com sucesso! Boa sorte.' };
  } catch (error) {
    console.error('Place bet error:', error);
    return { success: false, message: 'Erro ao processar a aposta. Tente novamente.' };
  }
}

export async function createMarket(
  question: string,
  description: string,
  expiresAt: Date,
  creatorId: string
) {
  try {
    if (!question || question.length < 5) {
      return { success: false, message: 'A pergunta deve ter pelo menos 5 caracteres.' };
    }

    if (expiresAt <= new Date()) {
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

    return { success: true, message: 'Aposta criada com sucesso!', marketId: market.id };
  } catch (error) {
    console.error('Create market error:', error);
    return { success: false, message: 'Erro ao criar a aposta. Tente novamente.' };
  }
}
