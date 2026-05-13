import React from 'react';
import { Button } from '../ui/Button';
import { Trophy, ArrowRight, BadgeCheck } from 'lucide-react';
import { motion } from 'framer-motion';

const formatCompletionTime = (date) => {
    const d = date instanceof Date ? date : new Date();
    const pad = (n) => String(n).padStart(2, '0');
    return `${pad(d.getHours())}:${pad(d.getMinutes())} · ${pad(d.getDate())}/${pad(d.getMonth() + 1)}/${d.getFullYear()}`;
};

const maskPhone = (phone) => {
    if (!phone) return '';
    const digits = String(phone).replace(/\D/g, '');
    if (digits.length < 4) return '';
    return `••••${digits.slice(-4)}`;
};

export const SuccessScreen = ({ onFinish, userName, userPhone, completedAt }) => {
    const displayName = (userName || '').trim();
    const phoneLabel = maskPhone(userPhone);
    const timeLabel = formatCompletionTime(completedAt);

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, type: 'spring' }}
            className="flex flex-col items-center justify-center text-center px-4 min-h-full"
        >
            <div className="mb-5 relative">
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
                    <Trophy className="w-20 h-20 md:w-28 md:h-28 text-citics-blue relative z-10 drop-shadow-sm" />
                </motion.div>
            </div>

            <motion.h1
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="text-3xl md:text-5xl font-black text-slate-900 mb-4 tracking-tight"
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

            {displayName && (
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6 }}
                    className="w-full max-w-sm mb-6 rounded-2xl border border-citics-blue/20 bg-white/80 backdrop-blur-sm px-5 py-4 shadow-sm"
                >
                    <div className="flex items-center justify-center gap-2 mb-2 text-citics-blue">
                        <BadgeCheck className="w-4 h-4" />
                        <span className="text-xs uppercase tracking-wider font-semibold">Xác nhận hoàn thành</span>
                    </div>
                    <p className="text-xl md:text-2xl font-bold text-slate-900 leading-tight break-words">
                        {displayName}
                    </p>
                    {phoneLabel && (
                        <p className="text-sm text-slate-600 mt-1 font-mono tracking-wider">
                            SĐT {phoneLabel}
                        </p>
                    )}
                    <p className="text-xs text-slate-500 mt-1.5 font-mono">
                        {timeLabel}
                    </p>
                </motion.div>
            )}

            <motion.p
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.65 }}
                className="text-base text-slate-500 mb-6 max-w-sm leading-relaxed"
            >
                Quay lại Citics Agent để kích hoạt quyền lợi và tiếp tục hoạt động trên hệ thống.
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
