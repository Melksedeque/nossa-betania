'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';

interface ImageInputProps {
  name: string;
  defaultImage?: string | null;
  label?: string;
  accept?: string;
}

export function ImageInput({ 
  name, 
  defaultImage, 
  label = 'Imagem', 
  accept = 'image/*' 
}: ImageInputProps) {
  const [previewUrl, setPreviewUrl] = useState<string | null>(defaultImage || null);
  const [inputType, setInputType] = useState<'file' | 'url'>('file');
  const [urlValue, setUrlValue] = useState('');

  // Limpar URL.createObjectURL quando o componente desmontar ou mudar
  useEffect(() => {
    return () => {
      if (previewUrl && previewUrl.startsWith('blob:')) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) {
      if (previewUrl && previewUrl.startsWith('blob:')) {
        URL.revokeObjectURL(previewUrl);
      }
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    }
  }

  function handleUrlChange(e: React.ChangeEvent<HTMLInputElement>) {
    const url = e.target.value;
    setUrlValue(url);
    if (url) {
      setPreviewUrl(url);
    } else {
      setPreviewUrl(defaultImage || null);
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <label className="block text-sm font-medium text-slate-300">
          {label}
        </label>
        <div className="flex bg-slate-800 rounded-lg p-1 border border-slate-700">
          <button
            type="button"
            onClick={() => setInputType('file')}
            className={`px-3 py-1 rounded-md text-xs font-medium transition-colors cursor-pointer ${
              inputType === 'file'
                ? 'bg-slate-600 text-white'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Upload
          </button>
          <button
            type="button"
            onClick={() => setInputType('url')}
            className={`px-3 py-1 rounded-md text-xs font-medium transition-colors cursor-pointer ${
              inputType === 'url'
                ? 'bg-slate-600 text-white'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Link (URL)
          </button>
        </div>
      </div>

      <div className="flex gap-6 items-start">
        {/* Preview */}
        <div className="shrink-0">
          <div className="relative w-24 h-24 border border-slate-700 rounded-lg overflow-hidden bg-slate-800 flex items-center justify-center">
            {previewUrl ? (
              <Image
                src={previewUrl}
                alt="Preview"
                fill
                className="object-cover cursor-pointer"
                sizes="96px"
              />
            ) : (
              <div className="text-slate-500 text-xs text-center p-2">
                Sem imagem
              </div>
            )}
          </div>
        </div>

        {/* Inputs */}
        <div className="flex-1">
          {inputType === 'file' ? (
            <div className="space-y-2">
              <input
                type="file"
                name={name}
                accept={accept}
                onChange={handleFileChange}
                className="block w-full text-sm text-slate-400
                  file:mr-4 file:py-2 file:px-4
                  file:rounded-full file:border-0
                  file:text-xs file:font-semibold
                  file:bg-orange-500/10 file:text-orange-500
                  hover:file:bg-orange-500/20
                  cursor-pointer"
              />
              <p className="text-xs text-slate-500">
                Recomendado: JPG ou PNG, max 2MB.
              </p>
            </div>
          ) : (
            <div className="space-y-2">
              <input
                type="url"
                name={`${name}_url`}
                value={urlValue}
                onChange={handleUrlChange}
                placeholder="https://exemplo.com/imagem.png"
                className="w-full rounded-md border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-white placeholder-slate-500 focus:border-orange-500 focus:outline-none focus:ring-1 focus:ring-orange-500"
              />
              <p className="text-xs text-slate-500">
                Cole o link direto da imagem.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
