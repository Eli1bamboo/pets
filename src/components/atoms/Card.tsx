import React from 'react';
import { cn } from '@/lib/utils';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
    variant?: 'standard' | 'flat' | 'highlight' | 'admin';
    padding?: 'none' | 'sm' | 'md' | 'lg';
}

export const Card = React.forwardRef<HTMLDivElement, CardProps>(
    ({ className, variant = 'standard', padding = 'md', children, ...props }, ref) => {
        return (
            <div
                ref={ref}
                className={cn(
                    'transition-all duration-200 overflow-hidden',
                    variant === 'standard' && 'bg-white rounded-3xl shadow-sm border border-brand-50/50',
                    variant === 'admin' && 'bg-white rounded-xl shadow-sm border border-slate-200',
                    variant === 'flat' && 'bg-transparent',
                    variant === 'highlight' && 'bg-white rounded-3xl border-4 border-brand-500 shadow-lg',

                    padding === 'none' && 'p-0',
                    padding === 'sm' && 'p-4',
                    padding === 'md' && 'p-6',
                    padding === 'lg' && 'p-8',

                    className
                )}
                {...props}
            >
                {children}
            </div>
        );
    }
);
Card.displayName = 'Card';
