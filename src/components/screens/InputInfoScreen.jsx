import React, { useState } from 'react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { motion } from 'framer-motion';
import formFields from '../../data/formFields.json';

export const InputInfoScreen = ({ onNext }) => {
    const [formData, setFormData] = useState({});
    const [errors, setErrors] = useState({});

    const validate = () => {
        let newErrors = {};
        formFields.forEach(field => {
            if (field.required) {
                if (field.type === 'multiselect') {
                    if (!formData[field.id] || formData[field.id].length !== field.maxSelect) {
                        newErrors[field.id] = field.errorMessage || `Vui lòng chọn đủ ${field.maxSelect} mục`;
                    }
                } else if (!formData[field.id]) {
                    newErrors[field.id] = field.errorMessage || 'Trường này là bắt buộc';
                }
            }
            if (formData[field.id] && field.pattern) {
                const regex = new RegExp(field.pattern);
                if (!regex.test(formData[field.id])) {
                    newErrors[field.id] = field.errorMessage || 'Định dạng không hợp lệ';
                }
            }
        });
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (validate()) {
            onNext(formData);
        }
    };

    const handleChange = (id, value) => {
        setFormData(prev => ({ ...prev, [id]: value }));
        if (errors[id]) {
            setErrors(prev => {
                const newErrs = { ...prev };
                delete newErrs[id];
                return newErrs;
            });
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
            <Card className="max-w-md w-full mx-auto p-6 md:p-8">
                <h2 className="text-2xl font-bold text-center text-white mb-6">Thông tin xác thực</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    {formFields.map((field) => (
                        <div key={field.id}>
                            <label className="block text-sm font-medium text-citics-lavender/70 mb-1">
                                {field.label} {field.required && <span className="text-red-400">*</span>}
                            </label>
                            {field.type === 'multiselect' ? (
                                <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                                    {field.options.map((option) => {
                                        const isSelected = (formData[field.id] || []).includes(option);
                                        return (
                                            <button
                                                key={option}
                                                type="button"
                                                onClick={() => {
                                                    const currentSelected = formData[field.id] || [];
                                                    let newSelected;
                                                    if (isSelected) {
                                                        newSelected = currentSelected.filter(item => item !== option);
                                                    } else {
                                                        if (currentSelected.length >= field.maxSelect) return; // Prevent selecting more than max
                                                        newSelected = [...currentSelected, option];
                                                    }
                                                    handleChange(field.id, newSelected);
                                                }}
                                                className={`px-3 py-2 text-xs md:text-sm rounded-lg border transition-all ${isSelected
                                                    ? 'bg-citics-turquoise text-citics-blue border-citics-turquoise font-bold'
                                                    : 'bg-white/5 border-white/20 text-white/70 hover:bg-white/10'
                                                    }`}
                                            >
                                                {option}
                                            </button>
                                        );
                                    })}
                                </div>
                            ) : (
                                <input
                                    type={field.type}
                                    placeholder={field.placeholder}
                                    value={formData[field.id] || ''}
                                    onChange={(e) => handleChange(field.id, e.target.value)}
                                    className={`w-full bg-citics-blue/50 border rounded-xl px-4 py-3 text-white placeholder-white/30 focus:outline-none focus:ring-1 transition-all
                                    ${errors[field.id]
                                            ? 'border-red-500 focus:border-red-500 focus:ring-red-500'
                                            : 'border-white/20 focus:border-citics-turquoise focus:ring-citics-turquoise'}`}
                                />
                            )}
                            {errors[field.id] && (
                                <p className="text-xs text-red-400 mt-1 ml-1">{errors[field.id]}</p>
                            )}
                        </div>
                    ))}

                    <Button type="submit" className="w-full mt-6 shadow-lg shadow-citics-turquoise/20">
                        Tiếp tục
                    </Button>
                </form>
            </Card>
        </motion.div>
    );
};
