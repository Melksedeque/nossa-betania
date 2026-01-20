'use client';

import { logout } from '@/app/lib/actions';
import { Button } from '@/components/Button';
import { LogOut } from 'lucide-react';

interface LogoutButtonProps {
  variant?: 'primary' | 'outline' | 'ghost' | 'destructive';
  size?: 'sm' | 'md' | 'lg';
}

export function LogoutButton({ variant = 'destructive', size = 'sm' }: LogoutButtonProps) {
  const handleLogout = async () => {
    await logout();
  };

  return (
    <Button
      type="button"
      variant={variant}
      size={size}
      className="cursor-pointer"
      onClick={handleLogout}
    >
      <LogOut className="w-4 h-4 mr-2" />
      Sair
    </Button>
  );
}
