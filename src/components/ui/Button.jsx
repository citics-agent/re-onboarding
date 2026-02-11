import React from 'react';
import { twMerge } from 'tailwind-merge';

export const Button = React.forwardRef(({
    className,
    variant = 'primary',
    size = 'md',
    children,
    ...props
}, ref) => {
    const variants = {
        primary: 'bg-citics-turquoise text-citics-blue hover:bg-white hover:text-citics-blue font-bold shadow-lg shadow-citics-turquoise/20',
        secondary: 'bg-citics-lavender text-citics-blue hover:bg-white font-medium',
        outline: 'border-2 border-citics-turquoise text-citics-turquoise hover:bg-citics-turquoise hover:text-citics-blue',
        ghost: 'text-citics-lavender hover:bg-citics-blue/50 hover:text-white',
    };

    const sizes = {
        sm: 'px-3 py-1.5 text-sm',
        md: 'px-6 py-3 text-base',
        lg: 'px-8 py-4 text-lg w-full'
    };

    return (
        <button
            ref={ref}
            className={twMerge(
                'rounded-full transition-all duration-300 active:scale-95 disabled:opacity-50 disabled:pointer-events-none flex items-center justify-center gap-2',
                variants[variant],
                sizes[size],
                className
            )}
            {...props}
        >
            {children}
        </button>
    );
});
