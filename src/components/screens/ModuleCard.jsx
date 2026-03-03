import React from 'react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { motion } from 'framer-motion';
import { SlideViewer } from '../ui/SlideViewer';
import { HelpCircle, Star } from 'lucide-react';

export const ModuleCard = ({ module, onStartQuiz, onBack }) => {
    const { id, title, description, content, quiz } = module;
    const moduleNum = String(id).padStart(2, '0');
    const questionCount = quiz?.length || 0;

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4 }}
            className="w-full"
        >
            <Card className="max-w-5xl w-full mx-auto overflow-visible relative">
                {/* Module number badge */}
                <div className="absolute -top-4 -right-2 md:-top-5 md:-right-3 z-10">
                    <div className="relative">
                        <div className="absolute inset-0 bg-citics-blue/10 blur-lg rounded-2xl" />
                        <div className="relative bg-white border border-slate-200 hover:border-citics-blue transition-colors text-slate-900 font-black text-2xl md:text-3xl px-4 py-2 rounded-2xl shadow-sm leading-none tracking-tight backdrop-blur-md">
                            {moduleNum}
                        </div>
                    </div>
                </div>

                {/* Header */}
                <div className="mb-4 pr-16">
                    <div className="text-xs text-slate-500 uppercase tracking-widest font-bold mb-1">Module {id}</div>
                    <h2 className="text-xl md:text-2xl font-black text-slate-900 leading-tight">{title}</h2>
                    <p className="text-slate-600 font-medium mt-1.5 text-sm leading-relaxed">{description}</p>
                </div>

                {/* Meta pills */}
                <div className="flex flex-wrap gap-2 mb-5">
                    <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-50 border border-slate-200 text-xs font-semibold text-slate-600">
                        <HelpCircle className="w-3 h-3 text-citics-blue" />
                        {questionCount} câu hỏi
                    </span>
                    <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-50 border border-slate-200 text-xs font-semibold text-slate-600">
                        <Star className="w-3 h-3 text-amber-500" />
                        Yêu cầu 4/{questionCount} để qua
                    </span>
                </div>

                {/* Content Area */}
                <div className="mb-6 rounded-xl overflow-hidden border border-slate-100 shadow-sm">
                    {content.type === 'video' ? (
                        <div className="aspect-video bg-slate-100 border border-slate-200 rounded-xl overflow-hidden">
                            <iframe
                                className="w-full h-full"
                                src={content.url}
                                title={title}
                                frameBorder="0"
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                allowFullScreen
                            />
                        </div>
                    ) : (
                        content.slides && content.slides.length > 0 ? (
                            <SlideViewer slides={content.slides} />
                        ) : (
                            <div className="aspect-video bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-center text-slate-400 font-medium text-sm">
                                Nội dung sẽ được cập nhật
                            </div>
                        )
                    )}
                </div>

                {/* CTA */}
                <div className="flex gap-3">
                    <Button type="button" variant="outline" onClick={onBack} className="w-1/3 text-slate-600 border-slate-200 hover:bg-slate-50 px-2 text-sm md:text-base">
                        Quay lại
                    </Button>
                    <Button
                        onClick={onStartQuiz}
                        className="w-2/3 shadow-lg shadow-citics-turquoise/20 font-semibold group px-2 text-sm md:text-base"
                    >
                        Bắt đầu
                        <span className="ml-2 group-hover:translate-x-1 inline-block transition-transform">→</span>
                    </Button>
                </div>
            </Card>
        </motion.div>
    );
};
