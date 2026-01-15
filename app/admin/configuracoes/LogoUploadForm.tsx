'use client';

import { useState } from 'react';
import { adminUploadLogo } from '@/app/lib/actions';
import { useToast } from '@/components/Toast';
import { ImageInput } from '@/components/ImageInput';

export function LogoUploadForm() {
  const [isUploading, setIsUploading] = useState(false);
  const { addToast } = useToast();

  async function handleSubmit(formData: FormData) {
    setIsUploading(true);
    try {
      const result = await adminUploadLogo(formData);
      if (result.success) {
        addToast(result.message, 'success');
      } else {
        addToast(result.message, 'error');
      }
    } catch {
      addToast('Erro inesperado ao enviar logo.', 'error');
    } finally {
      setIsUploading(false);
    }
  }

  return (
    <form action={handleSubmit} className="space-y-4">
      <ImageInput 
        name="logo" 
        label="Nova Logo" 
      />
      
      <div className="flex justify-end">
        <button
          type="submit"
          disabled={isUploading}
          className="inline-flex items-center justify-center px-4 py-2 rounded-lg bg-orange-500 hover:bg-orange-400 text-sm font-medium text-white disabled:opacity-50 disabled:cursor-not-allowed transition-colors cursor-pointer"
        >
          {isUploading ? 'Enviando...' : 'Atualizar Logo'}
        </button>
      </div>
    </form>
  );
}
