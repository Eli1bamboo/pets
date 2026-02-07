import React from 'react';
import { Label } from '../atoms/Label';
import { Input } from '../atoms/Input';

import { LucideIcon } from 'lucide-react';



interface FormFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label: string;
    error?: string;
    id: string;
    leftIcon?: LucideIcon;
    rightIcon?: LucideIcon;
    onRightIconClick?: () => void;
    variant?: 'customer' | 'admin';
}

export const FormField = React.forwardRef<HTMLInputElement, FormFieldProps>(
    ({ label, error, className, id, leftIcon, rightIcon, variant = 'customer', ...props }, ref) => {
        return (
            <div className={className}>
                <Label htmlFor={id} className="mb-2" variant={variant}>
                    {label}
                </Label>
                <div className="mt-2">
                    <Input
                        id={id}
                        ref={ref}
                        error={!!error}
                        leftIcon={leftIcon}
                        rightIcon={rightIcon}
                        variant={variant}
                        {...props}
                    />
                </div>
                {error && (
                    <p className="mt-2 text-sm text-red-600" id={`${id}-error`}>
                        {error}
                    </p>
                )}
            </div>
        );
    }
);
FormField.displayName = 'FormField';
