import React from 'react';
import { PackageOpen } from 'lucide-react';
import { Link } from 'react-router-dom';
import Button from './Button';

const EmptyState = ({
  icon: Icon = PackageOpen,
  title = 'No items found',
  message = 'There is nothing to display here at the moment.',
  actionLabel,
  onAction,
  actionLink,
  className = '',
}) => {
  return (
    <div
      className={`flex flex-col items-center justify-center text-center p-8 sm:p-12 rounded-2xl border-2 border-dashed border-slate-200 bg-white/60 ${className}`}
    >
      <div className="w-16 h-16 rounded-2xl bg-indigo-50 flex items-center justify-center text-indigo-600 mb-4 shadow-inner">
        <Icon className="w-8 h-8" />
      </div>

      <h3 className="text-lg font-semibold text-slate-900 mb-1.5">{title}</h3>
      <p className="text-sm text-slate-500 max-w-sm mb-6">{message}</p>

      {actionLabel && (
        <div>
          {actionLink ? (
            <Link to={actionLink}>
              <Button variant="primary">{actionLabel}</Button>
            </Link>
          ) : (
            <Button variant="primary" onClick={onAction}>
              {actionLabel}
            </Button>
          )}
        </div>
      )}
    </div>
  );
};

export default EmptyState;
