import { Loader2 } from 'lucide-react';

const Loader = ({ size = 'lg', text = 'Loading...' }) => {
  const sizeMap = {
    sm: 'w-6 h-6',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
  };

  return (
    <div className="flex flex-col items-center justify-center py-20 gap-4">
      <Loader2
        className={`${sizeMap[size] || sizeMap.lg} animate-spin text-indigo-600`}
      />
      {text && (
        <p className="text-sm text-gray-500 font-medium animate-pulse">{text}</p>
      )}
    </div>
  );
};

export default Loader;
