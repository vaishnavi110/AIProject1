import React from 'react';
import { Loader2 } from 'lucide-react';

const Loader = ({
  size = 'md',
  message = 'Loading...',
  fullPage = false,
  className = '',
}) => {
  const sizeMap = {
    sm: 'w-5 h-5',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
  };

  const content = (
    <div className={`flex flex-col items-center justify-center p-6 text-center ${className}`}>
      <Loader2
        className={`${sizeMap[size] || sizeMap.md} animate-spin text-indigo-600 mb-3`}
      />
      {message && (
        <p className="text-sm font-medium text-slate-600 animate-pulse">{message}</p>
      )}
    </div>
  );

  if (fullPage) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/80 backdrop-blur-sm">
        {content}
      </div>
    );
  }

  return content;
};

export default Loader;
