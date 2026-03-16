import React from 'react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { Home, Users, Landmark, Check, ArrowRight, ArrowLeft, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

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
    const [primaryRole, setPrimaryRole] = React.useState(null);
    const [secondaryRoles, setSecondaryRoles] = React.useState([]);
    const [showPopup, setShowPopup] = React.useState(false);
    const [wantsSecondary, setWantsSecondary] = React.useState(null); // null = not answered, true/false

    const popupAnswered = wantsSecondary !== null;

    const handleCardClick = (roleId) => {
        // Phase 1: No primary yet → set primary + show popup
        if (!primaryRole) {
            setPrimaryRole(roleId);
            setShowPopup(true);
            return;
        }

        // If popup hasn't been answered yet, ignore clicks
        if (!popupAnswered) return;

        // If not wanting secondary, ignore clicks on other cards
        if (!wantsSecondary && roleId !== primaryRole) return;

        // Clicking primary role → deselect, reset everything
        if (primaryRole === roleId) {
            setPrimaryRole(null);
            setSecondaryRoles([]);
            setWantsSecondary(null);
            return;
        }

        // Phase 2: Toggle secondary roles (max 2)
        if (secondaryRoles.includes(roleId)) {
            setSecondaryRoles(secondaryRoles.filter(r => r !== roleId));
        } else if (secondaryRoles.length < 2) {
            setSecondaryRoles([...secondaryRoles, roleId]);
        }
    };

    const handlePopupYes = () => {
        setWantsSecondary(true);
        setShowPopup(false);
    };

    const handlePopupNo = () => {
        setWantsSecondary(false);
        setShowPopup(false);
    };

    const handleConfirm = () => {
        if (primaryRole) {
            onSelect(primaryRole, secondaryRoles);
        }
    };

    const getTag = (roleId) => {
        if (primaryRole === roleId) return 'primary';
        if (secondaryRoles.includes(roleId)) return 'secondary';
        return null;
    };

    return (
        <>
            {/* Desktop: fixed side buttons — outside motion.div so fixed works correctly */}
            <Button
                type="button"
                variant="outline"
                onClick={onBack}
                className="hidden md:flex fixed left-4 top-1/2 -translate-y-1/2 z-40 py-3 px-3 text-slate-600 border-slate-300 hover:bg-slate-50 shadow-lg bg-white items-center gap-2 group overflow-hidden transition-all duration-300 hover:px-4"
            >
                <ArrowLeft className="w-4 h-4 shrink-0" />
                <span className="max-w-0 overflow-hidden group-hover:max-w-[80px] transition-all duration-300 whitespace-nowrap">Quay lại</span>
            </Button>
            {popupAnswered && (
                <Button
                    type="button"
                    onClick={handleConfirm}
                    className="hidden md:flex fixed right-4 top-1/2 -translate-y-1/2 z-40 px-4 py-3 bg-citics-blue hover:bg-citics-blue/90 text-white items-center gap-2 shadow-lg"
                >
                    Hoàn thành
                    <ArrowRight className="w-4 h-4" />
                </Button>
            )}

            {/* Mobile: fixed bottom bar */}
            <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/90 backdrop-blur border-t border-slate-200 px-4 py-3 flex items-center justify-between">
                <Button type="button" variant="outline" onClick={onBack} className="px-3 py-2 text-slate-600 border-slate-300">
                    <ArrowLeft className="w-4 h-4" />
                </Button>
                {popupAnswered && (
                    <Button
                        type="button"
                        onClick={handleConfirm}
                        className="px-4 py-2 bg-citics-blue hover:bg-citics-blue/90 text-white flex items-center gap-2"
                    >
                        Hoàn thành
                        <ArrowRight className="w-4 h-4" />
                    </Button>
                )}
            </div>

            <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="max-w-4xl w-full mx-auto text-center px-4 pt-4"
            >
                <h2 className="text-2xl md:text-4xl font-black text-citics-blue mb-3 tracking-tight">Chọn Role hợp tác</h2>
                <p className="text-slate-600 font-medium mb-6">Lựa chọn này sẽ giúp CACN hiểu rõ hơn về nhu cầu hợp tác bao gồm Role chính và những Role phụ của bạn</p>

                <div className="grid grid-cols-2 gap-3 md:gap-5">
                    {roles.map((role, i) => {
                        const Icon = role.icon;
                        const tag = getTag(role.id);
                        const isSelected = tag !== null;
                        const isDisabled = primaryRole && !isSelected && (
                            !popupAnswered ||
                            !wantsSecondary ||
                            secondaryRoles.length >= 2
                        );

                        return (
                            <motion.div
                                key={role.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: i * 0.1 }}
                            >
                                <div className="relative h-full">
                                    {tag && (
                                        <div className={`absolute -top-2 right-2 z-10 px-2 py-0.5 rounded-full text-xs font-bold text-white flex items-center gap-1
                                        ${tag === 'primary' ? 'bg-citics-blue' : 'bg-citics-teal'}
                                    `}>
                                            <Check className="w-3 h-3" />
                                            {tag === 'primary' ? 'Role chính' : 'Role phụ'}
                                        </div>
                                    )}
                                <Card
                                    className={`cursor-pointer transition-all duration-300 group relative overflow-hidden h-full
                                    ${tag === 'primary' ? 'border-citics-blue shadow-lg shadow-citics-blue/10 ring-2 ring-citics-blue' : ''}
                                    ${tag === 'secondary' ? 'border-citics-teal shadow-md ring-2 ring-citics-teal' : ''}
                                    ${!isSelected && !isDisabled ? 'hover:border-citics-blue hover:shadow-lg hover:shadow-citics-blue/10' : ''}
                                    ${isDisabled ? 'opacity-40 cursor-not-allowed' : ''}
                                `}
                                    onClick={() => !isDisabled && handleCardClick(role.id)}
                                >

                                    <div className={`absolute inset-0 transition-opacity duration-300
                                    ${tag === 'primary' ? 'bg-blue-50 opacity-100' : ''}
                                    ${tag === 'secondary' ? 'bg-citics-teal/10 opacity-100' : ''}
                                    ${!isSelected ? 'bg-slate-50 opacity-0 group-hover:opacity-100' : ''}
                                `} />

                                    <div className={`relative bg-white border rounded-full w-14 h-14 md:w-20 md:h-20 mx-auto flex items-center justify-center mb-3 transition-all duration-300 shadow-sm
                                    ${tag === 'primary' ? 'border-citics-blue scale-110' : ''}
                                    ${tag === 'secondary' ? 'border-citics-teal scale-105' : ''}
                                    ${!isSelected ? 'border-slate-200 group-hover:scale-110 group-hover:border-citics-blue' : ''}
                                `}>
                                        <Icon className={`w-6 h-6 md:w-9 md:h-9 transition-colors
                                        ${tag === 'primary' ? 'text-citics-blue' : ''}
                                        ${tag === 'secondary' ? 'text-citics-teal' : ''}
                                        ${!isSelected ? 'text-slate-400 group-hover:text-citics-blue' : ''}
                                    `} />
                                    </div>
                                    <h3 className={`relative text-xl font-bold mb-2 transition-colors
                                    ${tag === 'primary' ? 'text-citics-blue' : ''}
                                    ${tag === 'secondary' ? 'text-citics-teal' : ''}
                                    ${!isSelected ? 'text-slate-900 group-hover:text-citics-blue' : ''}
                                `}>{role.title}</h3>
                                    <p className="relative text-slate-600 text-sm leading-relaxed">
                                        {role.description}
                                    </p>
                                </Card>
                                </div>
                            </motion.div>
                        );
                    })}
                </div>

                {/* Spacer for mobile fixed bottom bar */}
                <div className="md:hidden h-16" />

                {/* Popup */}
                <AnimatePresence>
                    {showPopup && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 px-4"
                        >
                            <motion.div
                                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                                animate={{ opacity: 1, scale: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.9, y: 20 }}
                                className="bg-white rounded-2xl p-6 md:p-8 max-w-md w-full shadow-2xl"
                            >
                                <h3 className="text-lg md:text-xl font-bold text-slate-900 mb-3">
                                    Hợp tác thêm cùng CACN?
                                </h3>
                                <p className="text-slate-600 text-sm md:text-base mb-6 leading-relaxed">
                                    Bạn có muốn hợp tác với CACN các Role khác để đa dạng nguồn thu nhập của mình không?
                                </p>
                                <div className="flex flex-col gap-3">
                                    <Button
                                        type="button"
                                        onClick={handlePopupYes}
                                        className="w-full bg-citics-blue hover:bg-citics-blue/90 text-white"
                                    >
                                        Có, tôi muốn hợp tác thêm
                                    </Button>
                                    <Button
                                        type="button"
                                        variant="outline"
                                        onClick={handlePopupNo}
                                        className="w-full text-slate-600 border-slate-300 hover:bg-slate-50"
                                    >
                                        Không, chỉ hợp tác 01 Role chính
                                    </Button>
                                </div>
                            </motion.div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </motion.div>
        </>
    );
};
