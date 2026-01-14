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
    await signIn('credentials', formData);
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
