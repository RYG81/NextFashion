import React from 'react';
import { cn } from '../../utils/cn';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger' | 'success' | 'outline' | 'gradient';
  size?: 'xs' | 'sm' | 'md' | 'lg';
  loading?: boolean;
  icon?: React.ReactNode;
  iconRight?: React.ReactNode;
}

export function Button({
  variant = 'primary', size = 'md', loading, icon, iconRight,
  className, children, disabled, ...props
}: ButtonProps) {
  const base = 'inline-flex items-center justify-center gap-2 font-medium rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 cursor-pointer';

  const variants = {
    primary: 'bg-violet-600 hover:bg-violet-500 text-white focus:ring-violet-500 shadow-lg shadow-violet-500/20',
    secondary: 'bg-gray-700 hover:bg-gray-600 text-gray-100 focus:ring-gray-500',
    ghost: 'bg-transparent hover:bg-gray-700/50 text-gray-300 hover:text-white focus:ring-gray-500',
    danger: 'bg-red-600 hover:bg-red-500 text-white focus:ring-red-500',
    success: 'bg-emerald-600 hover:bg-emerald-500 text-white focus:ring-emerald-500',
    outline: 'border border-gray-600 hover:border-violet-500 hover:bg-violet-500/10 text-gray-300 hover:text-violet-400 focus:ring-violet-500',
    gradient: 'bg-gradient-to-r from-violet-600 to-pink-600 hover:from-violet-500 hover:to-pink-500 text-white focus:ring-violet-500 shadow-lg',
  };

  const sizes = {
    xs: 'text-xs px-2.5 py-1.5',
    sm: 'text-sm px-3 py-2',
    md: 'text-sm px-4 py-2.5',
    lg: 'text-base px-5 py-3',
  };

  return (
    <button
      className={cn(base, variants[variant], sizes[size], (disabled || loading) && 'opacity-50 cursor-not-allowed', className)}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? (
        <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
        </svg>
      ) : icon}
      {children}
      {!loading && iconRight}
    </button>
  );
}
