import React from 'react';
import { Loader2 } from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'secondary' | 'outline' | 'danger' | 'ghost' | 'admin-primary' | 'admin-secondary' | 'admin-outline' | 'admin-danger';
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

            'admin-primary': 'bg-slate-900 text-white hover:bg-slate-800 shadow-sm rounded-lg',
            'admin-secondary': 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50 shadow-sm rounded-lg',
            'admin-outline': 'bg-transparent text-slate-600 border border-slate-300 hover:bg-slate-50 rounded-lg',
            'admin-danger': 'bg-red-600 text-white hover:bg-red-700 shadow-sm rounded-lg',

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
                    'flex items-center justify-center transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed',
                    !variant.startsWith('admin') && 'rounded-full',
                    variants[variant as keyof typeof variants],
                    sizes[size as keyof typeof sizes],
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
