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
        primary: 'bg-citics-blue text-white hover:bg-citics-blue/90 font-bold shadow-lg shadow-citics-blue/20',
        secondary: 'bg-slate-100 border border-slate-200 text-slate-700 hover:bg-slate-200 font-medium',
        outline: 'border-2 border-citics-blue text-citics-blue hover:bg-citics-blue/5 font-bold',
        ghost: 'text-slate-600 hover:bg-slate-100 hover:text-slate-900',
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
                'rounded-xl transition-all duration-300 active:scale-95 disabled:opacity-50 disabled:pointer-events-none flex items-center justify-center gap-2',
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
