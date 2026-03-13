import React from 'react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { Home, Users, Landmark } from 'lucide-react';
import { motion } from 'framer-motion';

const roles = [
    {
        id: 'Listing',
        title: 'Listing Agent (Thứ cấp)',
        description: 'Tìm kiếm nguồn hàng, khảo sát, ký gửi và niêm yết tài sản.',
        icon: Home,
    },
    {
        id: 'Buyer_ThuCap',
        title: 'Buyer Agent (Thứ cấp)',
        description: 'Tìm kiếm khách mua, tư vấn và phối hợp giao dịch.',
        icon: Users,
    },
    {
        id: 'Buyer_SoCap',
        title: 'Buyer Agent (Sơ cấp)',
        description: 'Tư vấn sản phẩm dự án, hỗ trợ booking và theo dõi giao dịch.',
        icon: Users,
    },
    {
        id: 'Mortgages',
        title: 'Mortgages Agent (Khoản vay)',
        description: 'Tư vấn sơ bộ nhu cầu vay thế chấp. Tạo và theo dõi hồ sơ vay trên hệ thống.',
        icon: Landmark,
    }
];

export const RoleSelection = ({ onSelect, onBack }) => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-4xl w-full mx-auto text-center px-4 self-start pt-4"
        >
            <h2 className="text-2xl md:text-4xl font-black text-citics-blue mb-3 tracking-tight">Chọn Role thực hiện dịch vụ</h2>
            <p className="text-slate-600 font-medium mb-6">Lựa chọn này sẽ cung cấp thông tin về Role bạn sẽ thực hiện cùng CACN.</p>

            <div className="grid md:grid-cols-3 gap-3 md:gap-6">
                {roles.map((role, i) => {
                    const Icon = role.icon;
                    return (
                        <motion.div
                            key={role.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.1 }}
                        >
                            <Card
                                className="cursor-pointer hover:border-citics-blue hover:shadow-lg hover:shadow-citics-blue/10 transition-all duration-300 group relative overflow-hidden h-full"
                                onClick={() => onSelect(role.id)}
                            >
                                <div className="absolute inset-0 bg-slate-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                                <div className="relative bg-white border border-slate-200 rounded-full w-14 h-14 md:w-20 md:h-20 mx-auto flex items-center justify-center mb-3 group-hover:scale-110 group-hover:border-citics-blue transition-all duration-300 shadow-sm">
                                    <Icon className="w-6 h-6 md:w-9 md:h-9 text-slate-400 group-hover:text-citics-blue transition-colors" />
                                </div>
                                <h3 className="relative text-xl font-bold text-slate-900 mb-2 group-hover:text-citics-blue transition-colors">{role.title}</h3>
                                <p className="relative text-slate-600 text-sm leading-relaxed">
                                    {role.description}
                                </p>
                            </Card>
                        </motion.div>
                    );
                })}
            </div>

            <div className="mt-4 md:mt-8">
                <Button type="button" variant="outline" onClick={onBack} className="w-full max-w-xs mx-auto text-slate-600 border-slate-300 hover:bg-slate-50">
                    Quay lại
                </Button>
            </div>
        </motion.div>
    );
};
