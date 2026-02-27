import React from 'react';
import { motion } from 'framer-motion';

export const ProgressBar = ({ progress }) => { // progress 0 to 100
    return (
        <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
            <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.8, ease: "circOut" }}
                className="h-full bg-citics-blue shadow-sm"
            />
        </div>
    );
};
