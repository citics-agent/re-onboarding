import React from 'react';
import { Button } from '../ui/Button';
import { motion } from 'framer-motion';

export const WelcomeScreen = ({ onStart }) => {
    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.5 }}
            className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4"
        >
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 tracking-tight">
                RE-ONBOARDING <span className="text-citics-turquoise">2026</span>
            </h1>
            <p className="text-xl text-citics-lavender/80 mb-10 max-w-lg leading-relaxed">
                Chào mừng bạn quay trở lại. Hãy hoàn thành chương trình cập nhật kiến thức để tiếp tục hoạt động cùng Citics.
            </p>
            <Button size="lg" onClick={onStart} className="max-w-xs mx-auto shadow-lg shadow-citics-turquoise/25 hover:shadow-citics-turquoise/40">
                Bắt đầu ngay
            </Button>
        </motion.div>
    );
};
