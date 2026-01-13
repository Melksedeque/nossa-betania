import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  title?: string;
}

export const Card = ({ children, className = '', title }: CardProps) => {
  return (
    <div className={`bg-slate-800 rounded-lg border border-slate-700 shadow-sm ${className}`}>
      {title && (
        <div className="p-6 border-b border-slate-700">
          <h3 className="text-xl font-bold text-slate-100">{title}</h3>
        </div>
      )}
      <div className="p-6">
        {children}
      </div>
    </div>
  );
};
