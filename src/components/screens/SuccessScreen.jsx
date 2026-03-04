import React from 'react';
import { Button } from '../ui/Button';
import { Trophy, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

export const SuccessScreen = ({ onFinish }) => {
    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, type: 'spring' }}
            className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4"
        >
            <div className="mb-8 relative">
                <motion.div
                    animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0.8, 0.5] }}
                    transition={{ repeat: Infinity, duration: 3 }}
                    className="absolute inset-0 bg-citics-blue blur-[60px] opacity-20 rounded-full"
                />
                <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.3, duration: 0.5 }}
                >
                    <Trophy className="w-28 h-28 text-citics-blue relative z-10 drop-shadow-sm" />
                </motion.div>
            </div>

            <motion.h1
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="text-4xl md:text-5xl font-black text-slate-900 mb-4 tracking-tight"
            >
                HOÀN THÀNH <span className="text-citics-blue">XUẤT SẮC!</span>
            </motion.h1>
            <motion.p
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="text-lg text-slate-600 font-medium mb-4 max-w-md leading-relaxed"
            >
                Bạn đã vượt qua chương trình Re-Onboarding 2026.
            </motion.p>
            <motion.p
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="text-base text-slate-500 mb-10 max-w-sm leading-relaxed"
            >
                Tiếp theo, bạn sẽ được điều hướng về <span className="text-citics-blue font-bold">App Citics Agent</span> để kích hoạt dịch vụ.
            </motion.p>

            <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 }}
            >
                <Button size="lg" onClick={onFinish} className="max-w-xs mx-auto flex items-center gap-2">
                    Quay lại App Citics Agent
                    <ArrowRight className="w-4 h-4" />
                </Button>
            </motion.div>
        </motion.div>
    );
};
