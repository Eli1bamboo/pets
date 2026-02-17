import React from 'react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

interface LabelProps extends React.LabelHTMLAttributes<HTMLLabelElement> { }

export const Label = React.forwardRef<HTMLLabelElement, LabelProps>(
    ({ className, children, ...props }, ref) => {
        return (
            <label
                ref={ref}
                className={cn(
                    'block text-sm font-bold leading-6 mb-1.5 text-slate-700',
                    className
                )}
                {...props}
            >
                {children}
            </label>
        );
    }
);
Label.displayName = 'Label';
