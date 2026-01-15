'use client';

import { useState, useEffect } from 'react';
import { adminUploadLogo } from '@/app/lib/actions';
import { useToast } from '@/components/Toast';
import Image from 'next/image';

export function LogoUploadForm() {
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const { addToast } = useToast();

  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
    };
  }, [previewUrl]);

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];

    if (file) {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
      
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    }
  }

  async function handleSubmit(formData: FormData) {
    setIsUploading(true);
    try {
      const result = await adminUploadLogo(formData);
      if (result.success) {
        addToast(result.message, 'success');
        setPreviewUrl(null); 
      } else {
        addToast(result.message, 'error');
      }
    } catch (_error) {
      addToast('Erro inesperado ao enviar logo.', 'error');
    } finally {
      setIsUploading(false);
    }
  }

  return (
    <form action={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-slate-300 mb-2">
          Nova Logo (PNG/JPG, max 2MB)
        </label>
        {previewUrl && (
          <div className="mb-4 relative w-32 h-32 border border-slate-700 rounded-lg overflow-hidden bg-slate-800">
            <Image 
              src={previewUrl} 
              alt="Prévia da logo" 
              className="w-full h-full object-contain"
            />
          </div>
        )}
        <div className="flex items-center gap-4">
          <input
            type="file"
            name="logo"
            accept="image/*"
            onChange={handleFileChange}
            className="block w-full text-sm text-slate-400
              file:mr-4 file:py-2 file:px-4
              file:rounded-full file:border-0
              file:text-xs file:font-semibold
              file:bg-orange-500/10 file:text-orange-500
              hover:file:bg-orange-500/20
              cursor-pointer"
            required
          />
          <button
            type="submit"
            disabled={isUploading}
            className="inline-flex items-center justify-center px-4 py-2 rounded-lg bg-orange-500 hover:bg-orange-400 text-sm font-medium text-white disabled:opacity-50 disabled:cursor-not-allowed transition-colors cursor-pointer"
          >
            {isUploading ? 'Enviando...' : 'Atualizar Logo'}
          </button>
        </div>
      </div>
    </form>
  );
}
