'use client';

import { mendigarRecarga } from '@/app/lib/actions';
import { useState } from 'react';
import { useToast } from '@/components/Toast';

export function MendigarButton({ userId }: { userId: string }) {
  const [loading, setLoading] = useState(false);
  const { addToast } = useToast();

  const handleMendigar = async () => {
    setLoading(true);
    const result = await mendigarRecarga(userId);
    setLoading(false);
    
    addToast(result.message, result.success ? 'success' : 'error');
  };

  return (
    <button 
      onClick={handleMendigar}
      disabled={loading}
      className="mt-2 text-xs text-orange-400 hover:text-orange-300 underline cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
    >
      {loading ? 'Pedindo...' : 'Mendigar Recarga (+100 A$)'}
    </button>
  );
}
