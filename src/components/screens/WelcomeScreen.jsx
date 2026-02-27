import React from 'react';
import { Button } from '../ui/Button';
import { motion } from 'framer-motion';
import { BookOpen, HelpCircle, Clock } from 'lucide-react';

const stats = [
    { icon: BookOpen, label: '2 Phần' },
    { icon: HelpCircle, label: '10 Câu hỏi' },
    { icon: Clock, label: '~5 phút' },
];

export const WelcomeScreen = ({ onStart }) => {
    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.5 }}
            className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4"
        >
            <h1 className="text-4xl md:text-6xl font-black text-citics-blue mb-6 tracking-tight">
                CITICS AGENT <br /> RE-ONBOARDING <span className="text-citics-turquoise"> 2026 </span>
            </h1>

            <p className="text-lg md:text-xl text-slate-600 mb-10 max-w-lg leading-relaxed font-medium">
                Hoàn thành chương trình để nhận được chính sách hoa hồng hấp dẫn cùng Citics
            </p>

            {/* Stat cards - kept as requested info */}
            <div className="flex flex-wrap justify-center gap-3 mb-12">
                {stats.map(({ icon: Icon, label }) => (
                    <div
                        key={label}
                        className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white border border-slate-200 shadow-sm text-sm text-slate-600 font-medium"
                    >
                        <Icon className="w-4 h-4 text-citics-blue" />
                        {label}
                    </div>
                ))}
            </div>

            <Button size="lg" onClick={onStart} className="max-w-xs mx-auto">
                Bắt đầu ngay →
            </Button>
        </motion.div>
    );
};
