import React, { forwardRef, useId } from 'react';

const Input = forwardRef(
  (
    {
      label,
      id,
      name,
      type = 'text',
      value,
      onChange,
      error,
      placeholder,
      required = false,
      disabled = false,
      helperText,
      icon: Icon = null,
      className = '',
      autoComplete,
      ...props
    },
    ref
  ) => {
    const generatedId = useId();
    const inputId = id || name || generatedId;

    return (
      <div className={`w-full ${className}`}>
        {label && (
          <label
            htmlFor={inputId}
            className="block text-sm font-medium text-slate-700 mb-1.5"
          >
            {label}
            {required && <span className="text-rose-500 ml-1">*</span>}
          </label>
        )}

        <div className="relative rounded-lg shadow-sm">
          {Icon && (
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
              <Icon className="w-5 h-5" />
            </div>
          )}

          <input
            ref={ref}
            id={inputId}
            name={name}
            type={type}
            value={value}
            onChange={onChange}
            disabled={disabled}
            placeholder={placeholder}
            autoComplete={autoComplete}
            required={required}
            className={`
              block w-full rounded-lg text-sm sm:leading-6 transition-colors duration-150
              ${Icon ? 'pl-10' : 'pl-3.5'} pr-3.5 py-2.5
              ${
                error
                  ? 'border-rose-300 text-rose-900 placeholder-rose-300 focus:border-rose-500 focus:ring-rose-500 bg-rose-50/30'
                  : 'border-slate-300 text-slate-900 placeholder-slate-400 focus:border-indigo-500 focus:ring-indigo-500 bg-white'
              }
              border focus:outline-none focus:ring-2 focus:ring-offset-0
              disabled:bg-slate-100 disabled:text-slate-500 disabled:cursor-not-allowed
            `}
            {...props}
          />
        </div>

        {error && (
          <p className="mt-1.5 text-xs text-rose-600 flex items-center gap-1 font-medium">
            <span>•</span> {error}
          </p>
        )}

        {!error && helperText && (
          <p className="mt-1.5 text-xs text-slate-500">{helperText}</p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';

export default Input;
