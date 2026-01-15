'use client';

import { ProfileForm } from './ProfileForm';

interface ProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: {
    name: string | null;
    email: string | null;
    image: string | null;
  };
}

export function ProfileModal({ isOpen, onClose, user }: ProfileModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-700 rounded-xl max-w-lg w-full shadow-2xl relative animate-in zoom-in-95 duration-200 overflow-hidden">
        <div className="flex items-center justify-between p-4 border-b border-slate-800 bg-slate-950/50">
          <h2 className="text-lg font-bold text-white">Editar Perfil</h2>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white transition-colors"
          >
            ✕
          </button>
        </div>
        
        <div className="p-6">
          <ProfileForm
            name={user.name}
            email={user.email}
            image={user.image}
            onSuccess={onClose}
          />
        </div>
      </div>
    </div>
  );
}
