import React from 'react';
import { Loader2 } from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'secondary' | 'outline' | 'danger';
    isLoading?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
    ({ className, variant = 'primary', isLoading, children, disabled, ...props }, ref) => {
        const variants = {
            primary: 'bg-brand-600 text-white hover:bg-brand-500 shadow-sm focus-visible:outline-brand-600',
            secondary: 'bg-brand-100 text-brand-700 hover:bg-brand-200',
            outline: 'bg-white text-brand-700 ring-1 ring-inset ring-brand-300 hover:bg-brand-50',
            danger: 'bg-red-50 text-red-700 hover:bg-red-100 ring-1 ring-inset ring-red-600/10',
        };

        return (
            <button
                ref={ref}
                disabled={disabled || isLoading}
                className={cn(
                    'flex w-full justify-center items-center rounded-md px-3 py-1.5 text-sm font-semibold leading-6 transition-all duration-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 disabled:opacity-50 disabled:cursor-not-allowed',
                    variants[variant],
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
