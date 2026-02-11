import React from 'react';
import { Card } from '../ui/Card';
import { Building2, Landmark } from 'lucide-react';
import { motion } from 'framer-motion';

export const RoleSelection = ({ onSelect }) => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-3xl w-full mx-auto text-center px-4"
        >
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-10 tracking-tight">Lựa chọn hướng phát triển</h2>

            <div className="grid md:grid-cols-2 gap-8">
                <Card
                    className="cursor-pointer hover:border-citics-turquoise hover:bg-citics-turquoise/10 transition-all duration-300 group relative overflow-hidden"
                    onClick={() => onSelect('Real Estate')}
                >
                    <div className="absolute inset-0 bg-gradient-to-br from-citics-turquoise/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                    <div className="bg-citics-blue/50 border border-white/10 rounded-full w-24 h-24 mx-auto flex items-center justify-center mb-6 group-hover:scale-110 group-hover:border-citics-turquoise transition-all duration-300 shadow-xl group-hover:shadow-citics-turquoise/30">
                        <Building2 className="w-10 h-10 text-citics-lavender group-hover:text-citics-turquoise transition-colors" />
                    </div>
                    <h3 className="text-2xl font-bold text-white mb-3 group-hover:text-citics-turquoise transition-colors">Môi giới Bất động sản</h3>
                    <p className="text-citics-lavender/70 text-base leading-relaxed">
                        Tập trung vào giao dịch Mua bán, Thuê cho thuê và Đầu tư.
                    </p>
                </Card>

                <Card
                    className="cursor-pointer hover:border-citics-amber hover:bg-citics-amber/10 transition-all duration-300 group relative overflow-hidden"
                    onClick={() => onSelect('Mortgage')}
                >
                    <div className="absolute inset-0 bg-gradient-to-br from-citics-amber/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                    <div className="bg-citics-blue/50 border border-white/10 rounded-full w-24 h-24 mx-auto flex items-center justify-center mb-6 group-hover:scale-110 group-hover:border-citics-amber transition-all duration-300 shadow-xl group-hover:shadow-citics-amber/30">
                        <Landmark className="w-10 h-10 text-citics-lavender group-hover:text-citics-amber transition-colors" />
                    </div>
                    <h3 className="text-2xl font-bold text-white mb-3 group-hover:text-citics-amber transition-colors">Chuyên gia Tín dụng</h3>
                    <p className="text-citics-lavender/70 text-base leading-relaxed">
                        Tập trung vào các giải pháp tài chính và hồ sơ vay vốn.
                    </p>
                </Card>
            </div>
        </motion.div>
    );
};
