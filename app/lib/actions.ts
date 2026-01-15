'use server';

import { signIn, signOut, auth } from '@/auth';
import { AuthError } from 'next-auth';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';
import { z } from 'zod';
import { revalidatePath } from 'next/cache';

const RegisterSchema = z.object({
  name: z.string().min(2, { message: 'Nome deve ter pelo menos 2 caracteres.' }),
  email: z.email({ message: 'Email inválido.' }),
  password: z.string().min(6, { message: 'A senha deve ter pelo menos 6 caracteres.' }),
});

const UpdateProfileSchema = z.object({
  name: z.string().min(2, { message: 'Nome deve ter pelo menos 2 caracteres.' }),
  image: z
    .string()
    .url({ message: 'URL de avatar inválida.' })
    .or(z.literal(''))
    .optional(),
});

const UpdatePasswordSchema = z.object({
  currentPassword: z.string().min(6, { message: 'Senha atual inválida.' }),
  newPassword: z.string().min(6, { message: 'A nova senha deve ter pelo menos 6 caracteres.' }),
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

export async function logout() {
  await signOut({ redirectTo: '/login' });
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

    if (option.market.creatorId === userId) {
      return { success: false, message: 'Você não pode apostar na sua própria criação. Isso seria conflito de interesses!' };
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
  creatorId: string,
  optionsInput: { label: string; probability: number }[] = []
) {
  try {
    const expiresAt = new Date(expiresAtString);

    if (!question || question.length < 5) {
      return { success: false, message: 'A pergunta deve ter pelo menos 5 caracteres.' };
    }

    if (isNaN(expiresAt.getTime()) || expiresAt <= new Date()) {
      return { success: false, message: 'A data de encerramento deve ser no futuro.' };
    }

    // Validar opções
    let optionsToCreate = [];
    if (optionsInput.length === 0) {
      // Padrão antigo se nada for enviado
      optionsToCreate = [
        { label: 'Sim', odds: 2.0 },
        { label: 'Não', odds: 2.0 },
      ];
    } else {
      if (optionsInput.length < 2) {
        return { success: false, message: 'A aposta deve ter pelo menos 2 opções.' };
      }

      const totalProbability = optionsInput.reduce((acc, curr) => acc + curr.probability, 0);
      if (Math.abs(totalProbability - 100) > 0.1) {
        return { success: false, message: 'A soma das probabilidades deve ser 100%.' };
      }

      optionsToCreate = optionsInput.map(opt => ({
        label: opt.label,
        odds: Number((100 / opt.probability).toFixed(2)) // 50% -> 2.0, 25% -> 4.0
      }));
    }

    const market = await prisma.market.create({
      data: {
        question,
        description,
        expiresAt,
        creatorId,
        status: 'OPEN',
        options: {
          create: optionsToCreate,
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

export async function addComment(marketId: string, userId: string, content: string) {
  try {
    if (!content || content.trim().length === 0) {
      return { success: false, message: 'O comentário não pode estar vazio.' };
    }

    if (content.length > 500) {
      return { success: false, message: 'Calma lá, textão! Máximo de 500 caracteres.' };
    }

    await prisma.comment.create({
      data: {
        content,
        marketId,
        userId,
      },
    });

    revalidatePath('/dashboard');
    return { success: true, message: 'Comentário enviado!' };
  } catch (error) {
    console.error('Add comment error:', error);
    return { success: false, message: 'Erro ao enviar comentário.' };
  }
}

export async function adminUpdateBetStatus(betId: string, status: string) {
  try {
    const session = await auth();
    if (!session?.user || session.user.role !== 'ADMIN') {
      return { success: false, message: 'Acesso negado.' };
    }

    const allowedStatuses = ['PENDING', 'WON', 'LOST'];
    if (!allowedStatuses.includes(status)) {
      return { success: false, message: 'Status inválido.' };
    }

    const bet = await prisma.bet.findUnique({
      where: { id: betId },
    });

    if (!bet || bet.deletedAt) {
      return { success: false, message: 'Aposta não encontrada.' };
    }

    await prisma.bet.update({
      where: { id: betId },
      data: { status },
    });

    revalidatePath('/admin');
    return { success: true, message: 'Status da aposta atualizado.' };
  } catch (error) {
    console.error('Admin update bet status error:', error);
    return { success: false, message: 'Erro ao atualizar status da aposta.' };
  }
}

export async function deleteComment(commentId: string, userId: string) {
  try {
    const comment = await prisma.comment.findUnique({
      where: { id: commentId },
      include: { market: true },
    });

    if (!comment) {
      return { success: false, message: 'Comentário não encontrado.' };
    }

    const isAuthor = comment.userId === userId;
    const isMarketCreator = comment.market.creatorId === userId;

    if (!isAuthor && !isMarketCreator) {
      return { success: false, message: 'Você não tem permissão para deletar este comentário.' };
    }

    await prisma.comment.update({
      where: { id: commentId },
      data: {
        deletedAt: new Date(),
        deletedById: userId,
      },
    });

    revalidatePath('/dashboard');
    return { success: true, message: 'Comentário removido.' };
  } catch (error) {
    console.error('Delete comment error:', error);
    return { success: false, message: 'Erro ao remover comentário.' };
  }
}

export async function adminUpdateComment(commentId: string, content: string) {
  try {
    const session = await auth();
    if (!session?.user || session.user.role !== 'ADMIN') {
      return { success: false, message: 'Acesso negado.' };
    }

    if (!content || content.trim().length === 0) {
      return { success: false, message: 'O comentário não pode estar vazio.' };
    }

    if (content.length > 500) {
      return { success: false, message: 'Máximo de 500 caracteres.' };
    }

    await prisma.comment.update({
      where: { id: commentId },
      data: { content: content.trim() },
    });

    revalidatePath('/admin');
    revalidatePath('/dashboard');
    return { success: true, message: 'Comentário atualizado com sucesso.' };
  } catch (error) {
    console.error('Admin update comment error:', error);
    return { success: false, message: 'Erro ao atualizar comentário.' };
  }
}

export async function adminDeleteComment(commentId: string) {
  try {
    const session = await auth();
    if (!session?.user || session.user.role !== 'ADMIN') {
      return { success: false, message: 'Acesso negado.' };
    }

    await prisma.comment.update({
      where: { id: commentId },
      data: {
        deletedAt: new Date(),
        deletedById: session.user.id,
      },
    });

    revalidatePath('/admin');
    revalidatePath('/dashboard');
    return { success: true, message: 'Comentário enviado para a lixeira.' };
  } catch (error) {
    console.error('Admin delete comment error:', error);
    return { success: false, message: 'Erro ao remover comentário.' };
  }
}

export async function adminRestoreComment(commentId: string) {
  try {
    const session = await auth();
    if (!session?.user || session.user.role !== 'ADMIN') {
      return { success: false, message: 'Acesso negado.' };
    }

    await prisma.comment.update({
      where: { id: commentId },
      data: {
        deletedAt: null,
        deletedById: null,
      },
    });

    revalidatePath('/admin');
    revalidatePath('/dashboard');
    return { success: true, message: 'Comentário restaurado.' };
  } catch (error) {
    console.error('Admin restore comment error:', error);
    return { success: false, message: 'Erro ao restaurar comentário.' };
  }
}

export async function adminHardDeleteComment(commentId: string) {
  try {
    const session = await auth();
    if (!session?.user || session.user.role !== 'ADMIN') {
      return { success: false, message: 'Acesso negado.' };
    }

    await prisma.comment.delete({
      where: { id: commentId },
    });

    revalidatePath('/admin');
    revalidatePath('/dashboard');
    return { success: true, message: 'Comentário removido permanentemente.' };
  } catch (error) {
    console.error('Admin hard delete comment error:', error);
    return { success: false, message: 'Erro ao remover comentário.' };
  }
}

export async function updateUserProfile(
  prevState: { success: boolean; message: string } | undefined,
  formData: FormData,
) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return { success: false, message: 'Não autorizado.' };
    }

    const validatedFields = UpdateProfileSchema.safeParse({
      name: formData.get('name') ?? '',
      image: formData.get('image') ?? '',
    });

    if (!validatedFields.success) {
      return { success: false, message: 'Dados inválidos. Verifique nome e avatar.' };
    }

    const { name, image } = validatedFields.data;

    await prisma.user.update({
      where: { id: session.user.id },
      data: {
        name,
        image: image && image !== '' ? image : null,
      },
    });

    revalidatePath('/dashboard');
    revalidatePath('/dashboard/perfil');

    return { success: true, message: 'Perfil atualizado com sucesso!' };
  } catch (error) {
    console.error('Update profile error:', error);
    return { success: false, message: 'Erro ao atualizar perfil.' };
  }
}

export async function toggleUserRole(userId: string) {
  try {
    const session = await auth();
    if (!session?.user || session.user.role !== 'ADMIN') {
      return { success: false, message: 'Acesso negado.' };
    }

    if (userId === session.user.id) {
      return { success: false, message: 'Você não pode alterar seu próprio cargo.' };
    }

    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
      return { success: false, message: 'Usuário não encontrado.' };
    }

    const newRole = user.role === 'ADMIN' ? 'USER' : 'ADMIN';

    await prisma.user.update({
      where: { id: userId },
      data: { role: newRole },
    });

    revalidatePath('/admin');
    return { success: true, message: `Usuário agora é ${newRole}.` };
  } catch (error) {
    console.error('Toggle role error:', error);
    return { success: false, message: 'Erro ao alterar cargo.' };
  }
}

export async function deleteUser(userId: string) {
  try {
    const session = await auth();
    if (!session?.user || session.user.role !== 'ADMIN') {
      return { success: false, message: 'Acesso negado.' };
    }

    if (userId === session.user.id) {
      return { success: false, message: 'Você não pode se deletar.' };
    }

    // Primeiro deletar dependências ou usar Cascade no Schema (assumindo Cascade ou limpeza manual)
    // O Schema geralmente tem onDelete: Cascade, mas vamos garantir
    await prisma.user.delete({
      where: { id: userId },
    });

    revalidatePath('/admin');
    return { success: true, message: 'Usuário removido com sucesso.' };
  } catch (error) {
    console.error('Delete user error:', error);
    return { success: false, message: 'Erro ao remover usuário.' };
  }
}

export async function adminUpdateMarket(
  marketId: string,
  data: { question?: string; description?: string | null },
) {
  try {
    const session = await auth();
    if (!session?.user || session.user.role !== 'ADMIN') {
      return { success: false, message: 'Acesso negado.' };
    }

    const { question, description } = data;

    if (question && question.length < 5) {
      return { success: false, message: 'A pergunta deve ter pelo menos 5 caracteres.' };
    }

    await prisma.market.update({
      where: { id: marketId },
      data: {
        ...(question !== undefined ? { question } : {}),
        ...(description !== undefined ? { description } : {}),
      },
    });

    revalidatePath('/admin');
    return { success: true, message: 'Mercado atualizado com sucesso.' };
  } catch (error) {
    console.error('Admin update market error:', error);
    return { success: false, message: 'Erro ao atualizar mercado.' };
  }
}

export async function adminDeleteMarket(marketId: string) {
  try {
    const session = await auth();
    if (!session?.user || session.user.role !== 'ADMIN') {
      return { success: false, message: 'Acesso negado.' };
    }

    await prisma.$transaction(async tx => {
      const now = new Date();

      await tx.market.update({
        where: { id: marketId },
        data: {
          deletedAt: now,
          deletedById: session.user.id,
        },
      });

      await tx.comment.updateMany({
        where: { marketId },
        data: {
          deletedAt: now,
          deletedById: session.user.id,
        },
      });

      await tx.bet.updateMany({
        where: {
          option: {
            marketId,
          },
        },
        data: {
          deletedAt: now,
          deletedById: session.user.id,
        },
      });
    });

    revalidatePath('/admin');
    revalidatePath('/dashboard');
    return { success: true, message: 'Mercado enviado para a lixeira.' };
  } catch (error) {
    console.error('Admin delete market error:', error);
    return { success: false, message: 'Erro ao remover mercado.' };
  }
}

export async function adminRestoreMarket(marketId: string) {
  try {
    const session = await auth();
    if (!session?.user || session.user.role !== 'ADMIN') {
      return { success: false, message: 'Acesso negado.' };
    }

    await prisma.$transaction(async tx => {
      await tx.market.update({
        where: { id: marketId },
        data: {
          deletedAt: null,
          deletedById: null,
        },
      });

      await tx.comment.updateMany({
        where: { marketId },
        data: {
          deletedAt: null,
          deletedById: null,
        },
      });

      await tx.bet.updateMany({
        where: {
          option: {
            marketId,
          },
        },
        data: {
          deletedAt: null,
          deletedById: null,
        },
      });
    });

    revalidatePath('/admin');
    revalidatePath('/dashboard');
    return { success: true, message: 'Mercado restaurado da lixeira.' };
  } catch (error) {
    console.error('Admin restore market error:', error);
    return { success: false, message: 'Erro ao restaurar mercado.' };
  }
}

export async function adminHardDeleteMarket(marketId: string) {
  try {
    const session = await auth();
    if (!session?.user || session.user.role !== 'ADMIN') {
      return { success: false, message: 'Acesso negado.' };
    }

    await prisma.$transaction(async tx => {
      await tx.bet.deleteMany({
        where: {
          option: {
            marketId,
          },
        },
      });

      await tx.comment.deleteMany({
        where: { marketId },
      });

      await tx.market.delete({
        where: { id: marketId },
      });
    });

    revalidatePath('/admin');
    revalidatePath('/dashboard');
    return { success: true, message: 'Mercado removido permanentemente.' };
  } catch (error) {
    console.error('Admin hard delete market error:', error);
    return { success: false, message: 'Erro ao remover mercado.' };
  }
}

export async function updatePassword(
  prevState: { success: boolean; message: string } | undefined,
  formData: FormData,
) {
  try {
    const session = await auth();

    if (!session?.user?.id || !session.user.email) {
      return { success: false, message: 'Não autorizado.' };
    }

    const validated = UpdatePasswordSchema.safeParse({
      currentPassword: formData.get('currentPassword') ?? '',
      newPassword: formData.get('newPassword') ?? '',
    });

    if (!validated.success) {
      return { success: false, message: 'Dados inválidos. Verifique as senhas.' };
    }

    const { currentPassword, newPassword } = validated.data;

    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
    });

    if (!user || !user.password) {
      return { success: false, message: 'Conta não suporta alteração de senha por aqui.' };
    }

    const isValid = await bcrypt.compare(currentPassword, user.password);
    if (!isValid) {
      return { success: false, message: 'Senha atual incorreta.' };
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    await prisma.user.update({
      where: { id: user.id },
      data: { password: hashedPassword },
    });

    return { success: true, message: 'Senha alterada com sucesso.' };
  } catch (error) {
    console.error('Update password error:', error);
    return { success: false, message: 'Erro ao alterar senha.' };
  }
}
