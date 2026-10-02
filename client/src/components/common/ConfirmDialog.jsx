import React from 'react';
import Modal from './Modal';
import Button from './Button';
import { AlertTriangle, AlertCircle } from 'lucide-react';

const ConfirmDialog = ({
  isOpen,
  onConfirm,
  onCancel,
  title = 'Confirm Action',
  message = 'Are you sure you want to proceed? This action cannot be undone.',
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  loading = false,
  variant = 'danger',
}) => {
  return (
    <Modal isOpen={isOpen} onClose={onCancel} maxWidth="sm">
      <div className="flex flex-col items-center text-center">
        <div
          className={`w-12 h-12 rounded-full flex items-center justify-center mb-4 ${
            variant === 'danger'
              ? 'bg-rose-100 text-rose-600'
              : 'bg-amber-100 text-amber-600'
          }`}
        >
          {variant === 'danger' ? (
            <AlertTriangle className="w-6 h-6" />
          ) : (
            <AlertCircle className="w-6 h-6" />
          )}
        </div>

        <h3 className="text-lg font-semibold text-slate-900 mb-2">{title}</h3>
        <p className="text-sm text-slate-500 mb-6">{message}</p>

        <div className="flex items-center justify-center gap-3 w-full">
          <Button
            variant="secondary"
            fullWidth
            onClick={onCancel}
            disabled={loading}
          >
            {cancelText}
          </Button>

          <Button
            variant={variant === 'danger' ? 'danger' : 'primary'}
            fullWidth
            onClick={onConfirm}
            loading={loading}
          >
            {confirmText}
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default ConfirmDialog;
