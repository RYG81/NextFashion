import React from 'react';
import { cn } from '../../utils/cn';

interface InputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'prefix' | 'suffix'> {
  label?: string;
  error?: string;
  hint?: string;
  suffix?: React.ReactNode;
  prefix?: React.ReactNode;
}

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  hint?: string;
}

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  hint?: string;
  options: { value: string; label: string }[];
}

export function Input({ label, error, hint, suffix, prefix, className, ...props }: InputProps) {
  return (
    <div className="space-y-1">
      {label && <label className="block text-sm font-medium text-gray-300">{label}</label>}
      <div className="relative flex items-center">
        {prefix && <div className="absolute left-3 text-gray-400">{prefix}</div>}
        <input
          className={cn(
            'w-full bg-gray-900/50 border border-gray-700 rounded-lg text-gray-100 placeholder-gray-500 text-sm transition-colors',
            'focus:outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500',
            prefix ? 'pl-10 pr-3 py-2.5' : 'px-3 py-2.5',
            suffix ? 'pr-10' : '',
            error && 'border-red-500',
            className
          )}
          {...props}
        />
        {suffix && <div className="absolute right-3 text-gray-400">{suffix}</div>}
      </div>
      {error && <p className="text-xs text-red-400">{error}</p>}
      {hint && !error && <p className="text-xs text-gray-500">{hint}</p>}
    </div>
  );
}

export function Textarea({ label, error, hint, className, ...props }: TextareaProps) {
  return (
    <div className="space-y-1">
      {label && <label className="block text-sm font-medium text-gray-300">{label}</label>}
      <textarea
        className={cn(
          'w-full bg-gray-900/50 border border-gray-700 rounded-lg text-gray-100 placeholder-gray-500 text-sm transition-colors',
          'focus:outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500',
          'px-3 py-2.5 min-h-[80px] resize-y',
          error && 'border-red-500',
          className
        )}
        {...props}
      />
      {error && <p className="text-xs text-red-400">{error}</p>}
      {hint && !error && <p className="text-xs text-gray-500">{hint}</p>}
    </div>
  );
}

export function Select({ label, error, hint, options, className, ...props }: SelectProps) {
  return (
    <div className="space-y-1">
      {label && <label className="block text-sm font-medium text-gray-300">{label}</label>}
      <select
        className={cn(
          'w-full bg-gray-900/50 border border-gray-700 rounded-lg text-gray-100 text-sm transition-colors',
          'focus:outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500',
          'px-3 py-2.5',
          error && 'border-red-500',
          className
        )}
        {...props}
      >
        {options.map(o => (
          <option key={o.value} value={o.value} className="bg-gray-800">{o.label}</option>
        ))}
      </select>
      {error && <p className="text-xs text-red-400">{error}</p>}
      {hint && !error && <p className="text-xs text-gray-500">{hint}</p>}
    </div>
  );
}

export function FieldWithAuto({
  label,
  value,
  onChange,
  onAuto,
  onRandomize,
  placeholder,
  multiline = false,
  rows = 3,
  hint,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  onAuto?: () => void;
  onRandomize?: () => void;
  placeholder?: string;
  multiline?: boolean;
  rows?: number;
  hint?: string;
}) {
  return (
    <div className="space-y-1">
      <div className="flex items-center justify-between">
        <label className="block text-sm font-medium text-gray-300">{label}</label>
        <div className="flex gap-1">
          {onRandomize && (
            <button
              type="button"
              onClick={onRandomize}
              className="text-xs px-2 py-1 rounded bg-gray-700 hover:bg-gray-600 text-gray-300 transition-colors"
              title="Randomize from database"
            >
              🎲 Random
            </button>
          )}
          {onAuto && (
            <button
              type="button"
              onClick={onAuto}
              className="text-xs px-2 py-1 rounded bg-violet-700 hover:bg-violet-600 text-white transition-colors"
              title="AI Generate"
            >
              ✨ AI
            </button>
          )}
        </div>
      </div>
      {multiline ? (
        <textarea
          value={value}
          onChange={e => onChange(e.target.value)}
          placeholder={placeholder}
          rows={rows}
          className="w-full bg-gray-900/50 border border-gray-700 rounded-lg text-gray-100 placeholder-gray-500 text-sm px-3 py-2.5 focus:outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500 resize-y"
        />
      ) : (
        <input
          value={value}
          onChange={e => onChange(e.target.value)}
          placeholder={placeholder}
          className="w-full bg-gray-900/50 border border-gray-700 rounded-lg text-gray-100 placeholder-gray-500 text-sm px-3 py-2.5 focus:outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500"
        />
      )}
      {hint && <p className="text-xs text-gray-500">{hint}</p>}
    </div>
  );
}
