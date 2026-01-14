import { auth } from '@/auth';
import { redirect } from 'next/navigation';
import { Card } from '@/components/Card';
import { ProfileForm } from '@/components/ProfileForm';

export default async function ProfilePage() {
  const session = await auth();

  if (!session?.user) {
    redirect('/login');
  }

  const user = session.user;

  return (
    <div className="min-h-screen bg-slate-900 p-6">
      <div className="max-w-xl mx-auto space-y-6">
        <Card className="border-slate-800 bg-slate-950/50">
          <h1 className="text-2xl font-bold text-white mb-4">Meu Perfil</h1>
          <ProfileForm
            name={user.name || ''}
            email={user.email || ''}
            image={user.image || ''}
          />
        </Card>
      </div>
    </div>
  );
}

