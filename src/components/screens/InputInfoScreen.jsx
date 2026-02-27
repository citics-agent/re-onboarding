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
            setErrors(prev => { const n = { ...prev }; delete n[id]; return n; });
        }
    };

    const inputClass = (id, isSelect = false) => `w-full bg-slate-50 border rounded-xl px-3.5 py-2.5 text-sm ${isSelect && !formData[id] ? 'text-slate-400' : 'text-slate-900'} placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-offset-0 transition-all ${errors[id]
        ? 'border-red-300 focus:border-red-500 focus:ring-red-200 bg-red-50/50'
        : 'border-slate-200 focus:border-citics-blue focus:ring-citics-blue/20 hover:border-slate-300'}`;

    return (
        <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.4 }}
            className="w-full"
        >
            <Card className="max-w-md w-full mx-auto p-5 md:p-6 lg:p-7">
                <h2 className="text-xl font-bold text-center text-slate-900 mb-5">Thông tin Agent</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    {formFields.map((field) => (
                        <div key={field.id} className="relative">
                            <label className="block text-[11px] font-bold text-slate-700 mb-1 uppercase tracking-wide">
                                {field.label}
                                {field.required && <span className="text-red-500 ml-1">*</span>}
                            </label>

                            {(field.description || !field.required) && (
                                <p className="text-[10px] text-slate-400 mb-2 italic -mt-0.5">
                                    {field.description}
                                    {!field.required && !field.description ? '(Tuỳ chọn)' : ''}
                                    {!field.required && field.description ? ' (Tuỳ chọn)' : ''}
                                </p>
                            )}

                            {/* Multiselect */}
                            {field.type === 'multiselect' ? (
                                <div className="max-h-40 overflow-y-auto pr-1 rounded-xl custom-scrollbar border border-slate-100 p-2 bg-slate-50/50">
                                    <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                                        {field.options.map((option) => {
                                            const isSelected = (formData[field.id] || []).includes(option);
                                            return (
                                                <button
                                                    key={option}
                                                    type="button"
                                                    onClick={() => {
                                                        const current = formData[field.id] || [];
                                                        let next;
                                                        if (isSelected) {
                                                            next = current.filter(i => i !== option);
                                                        } else {
                                                            if (current.length >= field.maxSelect) return;
                                                            next = [...current, option];
                                                        }
                                                        handleChange(field.id, next);
                                                    }}
                                                    className={`px-2 py-2 text-sm rounded-lg border transition-all ${isSelected
                                                        ? 'bg-citics-blue/10 text-citics-blue border-citics-blue font-bold shadow-sm'
                                                        : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50 hover:border-slate-300'
                                                        }`}
                                                >
                                                    {option}
                                                </button>
                                            );
                                        })}
                                    </div>
                                </div>
                            ) : field.type === 'select' ? (
                                /* Dropdown Select */
                                <div className="relative">
                                    <select
                                        value={formData[field.id] || ''}
                                        onChange={(e) => handleChange(field.id, e.target.value)}
                                        className={`${inputClass(field.id, true)} appearance-none cursor-pointer pr-10`}
                                    >
                                        <option value="" disabled>Chọn nghề nghiệp</option>
                                        {field.options.map((option) => (
                                            <option key={option} value={option} className="text-slate-900">{option}</option>
                                        ))}
                                    </select>
                                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-slate-400">
                                        <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" /></svg>
                                    </div>
                                </div>
                            ) : (
                                /* Text / Tel / Email */
                                <input
                                    type={field.type}
                                    placeholder={field.placeholder}
                                    value={formData[field.id] || ''}
                                    onChange={(e) => handleChange(field.id, e.target.value)}
                                    className={inputClass(field.id)}
                                />
                            )}

                            {errors[field.id] && (
                                <p className="text-[11px] font-medium text-red-500 mt-1.5 ml-1 absolute -bottom-5 left-0">{errors[field.id]}</p>
                            )}
                        </div>
                    ))}

                    <div className="pt-2">
                        <Button type="submit" className="w-full">
                            Tiếp tục
                        </Button>
                    </div>
                </form>
            </Card>
        </motion.div>
    );
};
