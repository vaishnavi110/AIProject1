import React from 'react';

const Badge = ({
  children,
  variant,
  status,
  size = 'md',
  dot = false,
  className = '',
}) => {
  // Map order statuses to variants if status prop is passed
  const getStatusVariant = (st) => {
    if (!st) return 'neutral';
    const s = String(st).toLowerCase().trim();
    switch (s) {
      case 'pending':
        return 'warning';
      case 'confirmed':
        return 'info';
      case 'shipped':
        return 'purple';
      case 'delivered':
        return 'success';
      case 'cancelled':
        return 'danger';
      default:
        return 'neutral';
    }
  };

  const activeVariant = status ? getStatusVariant(status) : variant || 'neutral';

  const variants = {
    neutral: 'bg-slate-100 text-slate-700 border-slate-200',
    primary: 'bg-indigo-50 text-indigo-700 border-indigo-200',
    success: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    warning: 'bg-amber-50 text-amber-800 border-amber-200',
    danger: 'bg-rose-50 text-rose-700 border-rose-200',
    info: 'bg-blue-50 text-blue-700 border-blue-200',
    purple: 'bg-purple-50 text-purple-700 border-purple-200',
  };

  const dotColors = {
    neutral: 'bg-slate-400',
    primary: 'bg-indigo-500',
    success: 'bg-emerald-500',
    warning: 'bg-amber-500',
    danger: 'bg-rose-500',
    info: 'bg-blue-500',
    purple: 'bg-purple-500',
  };

  const sizes = {
    sm: 'text-xs px-2 py-0.5',
    md: 'text-xs font-medium px-2.5 py-1',
    lg: 'text-sm font-medium px-3 py-1.5',
  };

  return (
    <span
      className={`
        inline-flex items-center gap-1.5 rounded-full border
        ${variants[activeVariant] || variants.neutral}
        ${sizes[size] || sizes.md}
        ${className}
      `}
    >
      {dot && (
        <span
          className={`w-1.5 h-1.5 rounded-full ${
            dotColors[activeVariant] || 'bg-slate-400'
          }`}
        />
      )}
      {children || status}
    </span>
  );
};

export default Badge;
