'use client';

import { logout } from '@/app/lib/actions';
import { Button } from '@/components/Button';

interface LogoutButtonProps {
  variant?: 'primary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
}

export function LogoutButton({ variant = 'ghost', size = 'sm' }: LogoutButtonProps) {
  const handleLogout = async () => {
    await logout();
  };

  return (
    <Button
      type="button"
      variant={variant}
      size={size}
      className="cursor-pointer text-xs md:text-sm text-slate-300 hover:text-white"
      onClick={handleLogout}
    >
      Sair
    </Button>
  );
}
