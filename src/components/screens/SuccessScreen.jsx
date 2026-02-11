import React from 'react';
import { Button } from '../ui/Button';
import { Trophy, CheckCheck } from 'lucide-react';
import { motion } from 'framer-motion';
// import Confetti from 'react-confetti'; // Skipped for now

export const SuccessScreen = ({ onFinish }) => {
    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, type: "spring" }}
            className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4"
        >
            <div className="mb-10 relative">
                <motion.div
                    animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0.8, 0.5] }}
                    transition={{ repeat: Infinity, duration: 3 }}
                    className="absolute inset-0 bg-citics-turquoise blur-[60px] opacity-40 rounded-full"
                />
                <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.3, duration: 0.5 }}
                >
                    <Trophy className="w-32 h-32 text-citics-turquoise relative z-10 drop-shadow-[0_0_20px_rgba(17,218,239,0.6)]" />
                </motion.div>
                <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.6, type: "spring" }}
                    className="absolute -bottom-2 -right-2 bg-citics-amber rounded-full p-2 z-20 shadow-lg"
                >
                    <CheckCheck className="w-8 h-8 text-white" />
                </motion.div>
            </div>

            <h1 className="text-4xl md:text-5xl font-bold text-white mb-6 tracking-tight">
                HOÀN THÀNH <span className="text-citics-turquoise">XUẤT SẮC!</span>
            </h1>
            <p className="text-xl text-citics-lavender/80 mb-10 max-w-lg leading-relaxed">
                Bạn đã chính thức vượt qua chương trình Re-Onboarding. Chúc bạn một năm 2026 bùng nổ cùng Citics!
            </p>

            <Button size="lg" onClick={onFinish} className="max-w-xs mx-auto animate-bounce-subtle shadow-lg shadow-citics-turquoise/30">
                Tham gia Group Zalo Ngay
            </Button>
        </motion.div>
    );
};
