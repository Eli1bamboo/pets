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
    onRightIconClick?: () => void;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
    ({ className, error, leftIcon: LeftIcon, rightIcon: RightIcon, onRightIconClick, ...props }, ref) => {
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
                        'block w-full rounded-2xl border-0 py-3.5 lg:py-5 px-6 text-brand-900 ring-2 ring-inset ring-brand-900/5 placeholder:text-brand-400 focus:ring-2 focus:ring-inset focus:ring-primary-orange text-base lg:text-lg sm:leading-6 transition-all duration-200 bg-white/50 hover:bg-white',
                        LeftIcon && 'pl-14',
                        RightIcon && 'pr-14',
                        error && 'ring-red-300 focus:ring-red-500',
                        className
                    )}
                    {...props}
                />
                {RightIcon && (
                    <div
                        className={cn(
                            "absolute inset-y-0 right-0 flex items-center pr-4",
                            onRightIconClick ? "cursor-pointer pointer-events-auto" : "pointer-events-none"
                        )}
                        onClick={onRightIconClick}
                    >
                        <RightIcon className={cn("h-5 w-5 text-gray-400 transition-colors", onRightIconClick && "hover:text-brand-600")} aria-hidden="true" />
                    </div>
                )}
            </div>
        );
    }
);
Input.displayName = 'Input';
