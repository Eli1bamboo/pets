import React from 'react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

import { LucideIcon } from 'lucide-react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    error?: boolean;
    leftIcon?: LucideIcon;
    rightIcon?: LucideIcon;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
    ({ className, error, leftIcon: LeftIcon, rightIcon: RightIcon, ...props }, ref) => {
        return (
            <div className="relative rounded-2xl shadow-sm">
                {LeftIcon && (
                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
                        <LeftIcon className="h-5 w-5 text-brand-600" aria-hidden="true" />
                    </div>
                )}
                <input
                    ref={ref}
                    className={cn(
                        'block w-full rounded-2xl border-0 py-4 text-brand-900 ring-2 ring-inset ring-brand-900/5 placeholder:text-brand-400 focus:ring-2 focus:ring-inset focus:ring-primary-orange sm:text-sm sm:leading-6 transition-all duration-200 bg-white/50 hover:bg-white',
                        LeftIcon && 'pl-11',
                        RightIcon && 'pr-11',
                        error && 'ring-red-300 focus:ring-red-500',
                        className
                    )}
                    {...props}
                />
                {RightIcon && (
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
                        <RightIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
                    </div>
                )}
            </div>
        );
    }
);
Input.displayName = 'Input';
