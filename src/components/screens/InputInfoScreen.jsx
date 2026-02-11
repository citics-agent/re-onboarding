import React from 'react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { useForm } from '../../hooks/useForm';
import { motion } from 'framer-motion';

export const InputInfoScreen = ({ onNext }) => {
    const { values, handleChange } = useForm({
        name: '',
        phone: '',
        agentId: ''
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        if (values.name && values.phone) {
            onNext(values);
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.4 }}
            className="w-full"
        >
            <Card className="max-w-md w-full mx-auto">
                <h2 className="text-2xl font-bold text-center text-white mb-6">Thông tin xác thực</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-citics-lavender/70 mb-1">Họ và Tên</label>
                        <input
                            type="text"
                            name="name"
                            value={values.name}
                            onChange={handleChange}
                            placeholder="Nguyen Van A"
                            className="w-full bg-citics-blue/50 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-white/30 focus:outline-none focus:border-citics-turquoise focus:ring-1 focus:ring-citics-turquoise transition-all"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-citics-lavender/70 mb-1">Số điện thoại (Zalo)</label>
                        <input
                            type="tel"
                            name="phone"
                            value={values.phone}
                            onChange={handleChange}
                            placeholder="0909xxxxxx"
                            className="w-full bg-citics-blue/50 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-white/30 focus:outline-none focus:border-citics-turquoise focus:ring-1 focus:ring-citics-turquoise transition-all"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-citics-lavender/70 mb-1">Mã nhân viên / Agent ID (Nếu có)</label>
                        <input
                            type="text"
                            name="agentId"
                            value={values.agentId}
                            onChange={handleChange}
                            placeholder="AGT..."
                            className="w-full bg-citics-blue/50 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-white/30 focus:outline-none focus:border-citics-turquoise focus:ring-1 focus:ring-citics-turquoise transition-all"
                        />
                    </div>

                    <Button type="submit" className="w-full mt-6 shadow-lg shadow-citics-turquoise/20">
                        Tiếp tục
                    </Button>
                </form>
            </Card>
        </motion.div>
    );
};
