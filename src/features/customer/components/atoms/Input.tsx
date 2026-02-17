import React from 'react';
import { cn } from '@/utils/cn';
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
            <div className="relative">
                {LeftIcon && (
                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
                        <LeftIcon className={cn("h-5 w-5 text-brand-600")} aria-hidden="true" />
                    </div>
                )}
                <input
                    ref={ref}
                    className={cn(
                        'block w-full transition-all duration-200 outline-none',
                        'rounded-xl border border-brand-200 py-3.5 px-4 text-brand-900 placeholder:text-brand-400 focus:border-brand-500 focus:ring-1 focus:ring-brand-500 bg-white shadow-sm',
                        LeftIcon && 'pl-11',
                        RightIcon && 'pr-11',
                        error && 'border-red-300 focus:border-red-500 focus:ring-red-500',
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
                        <RightIcon className={cn("h-5 w-5 transition-colors", onRightIconClick && "hover:text-brand-600", "text-brand-300")} aria-hidden="true" />
                    </div>
                )}
            </div>
        );
    }
);
Input.displayName = 'Input';
