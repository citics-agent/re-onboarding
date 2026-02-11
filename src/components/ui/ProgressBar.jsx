import React from 'react';
import { motion } from 'framer-motion';

export const ProgressBar = ({ progress }) => { // progress 0 to 100
    return (
        <div className="w-full h-2 bg-citics-blue/50 rounded-full overflow-hidden border border-white/10">
            <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.8, ease: "circOut" }}
                className="h-full bg-citics-turquoise shadow-[0_0_10px_rgba(17,218,239,0.5)]"
            />
        </div>
    );
};
