import React from 'react';
import { cn } from '../../utils/cn';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
  glow?: boolean;
  onClick?: () => void;
}

export function Card({ children, className, hover, glow, onClick }: CardProps) {
  return (
    <div
      onClick={onClick}
      className={cn(
        'bg-gray-800/60 backdrop-blur-sm border border-gray-700/50 rounded-xl',
        hover && 'hover:border-violet-500/50 hover:bg-gray-800/80 transition-all duration-200 cursor-pointer',
        glow && 'shadow-lg shadow-violet-500/10',
        onClick && 'cursor-pointer',
        className
      )}
    >
      {children}
    </div>
  );
}

export function CardHeader({ children, className }: { children: React.ReactNode; className?: string }) {
  return <div className={cn('p-4 border-b border-gray-700/50', className)}>{children}</div>;
}

export function CardBody({ children, className }: { children: React.ReactNode; className?: string }) {
  return <div className={cn('p-4', className)}>{children}</div>;
}

export function CardFooter({ children, className }: { children: React.ReactNode; className?: string }) {
  return <div className={cn('px-4 py-3 border-t border-gray-700/50 bg-gray-900/30 rounded-b-xl', className)}>{children}</div>;
}
