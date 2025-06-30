import React from 'react';
import Loader from '../loader-component';
interface SimpleButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger'  | 'outline';
  size?: 'sm' | 'md' | 'lg';
  children: React.ReactNode;
  className?: string;
  loading?: boolean;
}

const base = 'cursor-pointer inline-flex items-center justify-center rounded-md font-normal transition-colors bg-transparent';

const sizes = {
  sm: 'px-2 py-1 text-xs',
  md: 'px-3 py-2 text-sm',
  lg: 'px-4 py-2 text-base',
};

const variants = {
  primary: 'text-blue-800 hover:bg-blue-50',
  secondary: 'text-gray-800 hover:bg-gray-50',
  danger: 'text-red-700 hover:bg-red-50',
  outline: 'text-gray-800 border border-gray-200 hover:bg-gray-50',
};

export const SimpleButton = React.forwardRef<HTMLButtonElement, SimpleButtonProps>(
  ({ variant = 'primary', size = 'md', children, className = '',loading, ...rest }, ref) => (
    <button
      ref={ref}
      className={[
        base,
        sizes[size],
        variants[variant],
        className,
      ].join(' ')}
      {...rest}
    >
      {loading ? <Loader size="sm" className="text-white flex-row justify-center gap-2" /> : children}
    </button>
  )
);

SimpleButton.displayName = 'SimpleButton';