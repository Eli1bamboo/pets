import React from 'react';
import { Loader2 } from 'lucide-react';
import { cn } from '@/utils/cn';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'secondary' | 'outline' | 'danger' | 'ghost';
    size?: 'sm' | 'md' | 'lg' | 'icon';
    isLoading?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
    ({ className, variant = 'primary', size = 'md', isLoading, children, disabled, ...props }, ref) => {
        const variants = {
            primary: 'bg-brand-500 text-white hover:bg-brand-600 shadow-md hover:shadow-lg active:scale-95',
            secondary: 'bg-brand-100 text-brand-900 hover:bg-brand-200',
            outline: 'bg-white text-brand-500 border-2 border-brand-500 hover:bg-brand-50',
            ghost: 'bg-transparent text-brand-600 hover:bg-brand-50 hover:text-brand-800',
            danger: 'bg-red-50 text-red-700 hover:bg-red-100 border border-red-200',
        };

        const sizes = {
            sm: 'px-3 py-1.5 text-xs',
            md: 'px-6 py-3 text-sm font-medium',
            lg: 'px-8 py-4 text-base',
            icon: 'p-2',
        };

        return (
            <button
                ref={ref}
                disabled={disabled || isLoading}
                className={cn(
                    'flex items-center justify-center transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed rounded-full',
                    variants[variant],
                    sizes[size],
                    className
                )}
                {...props}
            >
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {children}
            </button>
        );
    }
);
Button.displayName = 'Button';
