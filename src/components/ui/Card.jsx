import React from 'react';
import { twMerge } from 'tailwind-merge';
import { motion } from 'framer-motion';

export const Card = ({ className, children, ...props }) => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4 }}
            className={twMerge(
                "bg-white/10 border border-white/20 rounded-3xl p-6 shadow-2xl backdrop-blur-md",
                className
            )}
            {...props}
        >
            {children}
        </motion.div>
    );
};
