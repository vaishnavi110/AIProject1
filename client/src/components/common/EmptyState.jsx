import { ShoppingBag } from 'lucide-react';
import Button from './Button';

const EmptyState = ({
  icon: Icon = ShoppingBag,
  title = 'Nothing here yet',
  message = 'Get started by exploring our collection.',
  actionLabel,
  onAction,
}) => {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-6 text-center">
      <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-indigo-100 to-purple-100 flex items-center justify-center mb-6">
        <Icon className="w-10 h-10 text-indigo-500" />
      </div>
      <h3 className="text-xl font-semibold text-gray-800 mb-2">{title}</h3>
      <p className="text-gray-500 max-w-md mb-6">{message}</p>
      {actionLabel && onAction && (
        <Button onClick={onAction} variant="primary">
          {actionLabel}
        </Button>
      )}
    </div>
  );
};

export default EmptyState;
