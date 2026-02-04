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
            primary: 'bg-primary-orange text-white hover:bg-soft-peach shadow-lg hover:shadow-xl hover:scale-[1.02] active:scale-95 transition-all duration-200',
            secondary: 'bg-secondary-teal/10 text-secondary-teal hover:bg-secondary-teal/20',
            outline: 'bg-white text-brand-900 border-2 border-brand-900/10 hover:border-primary-orange hover:text-primary-orange',
            danger: 'bg-red-50 text-red-700 hover:bg-red-100 border border-red-200',
        };

        return (
            <button
                ref={ref}
                disabled={disabled || isLoading}
                className={cn(
                    'flex w-full justify-center items-center rounded-full px-6 py-3 text-base font-bold transition-all duration-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 disabled:opacity-50 disabled:cursor-not-allowed',
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
