import { auth } from '@/auth';
import { redirect } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import { DashboardHeader } from '@/components/DashboardHeader';
import { Breadcrumbs } from '@/components/Breadcrumbs';

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  if (!session?.user?.email) return redirect('/login');

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    select: {
      id: true,
      name: true,
      email: true,
      image: true,
      role: true,
      balance: true,
    }
  });

  if (!user) return redirect('/login');
  
  if (user.role !== 'ADMIN') {
    return redirect('/dashboard');
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 font-sans selection:bg-orange-500/30">
      <DashboardHeader user={user} />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
         <Breadcrumbs />
         <main className="mt-6">
            {children}
         </main>
      </div>
    </div>
  );
}
