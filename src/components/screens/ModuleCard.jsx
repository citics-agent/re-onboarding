import React from 'react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { motion } from 'framer-motion';
import { SlideViewer } from '../ui/SlideViewer';

export const ModuleCard = ({ module, onStartQuiz }) => {
    const { title, description, content } = module;

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.4 }}
            className="w-full"
        >
            <Card className="max-w-5xl w-full mx-auto">
                <h2 className="text-xl font-bold text-citics-turquoise mb-2">{title}</h2>
                <p className="text-citics-lavender/80 mb-4 text-sm">{description}</p>

                <div className="bg-black/40 rounded-xl overflow-hidden aspect-video mb-6 border border-white/10 flex items-center justify-center relative shadow-inner">
                    {content.type === 'video' ? (
                        <iframe
                            className="w-full h-full"
                            src={content.url}
                            title={title}
                            frameBorder="0"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                        ></iframe>
                    ) : (
                        /* Check if slides exist before rendering SlideViewer */
                        content.slides && content.slides.length > 0 ? (
                            <SlideViewer slides={content.slides} />
                        ) : (
                            <div className="text-white/50 text-sm">Chưa có dữ liệu slide</div>
                        )
                    )}
                </div>

                <Button onClick={onStartQuiz} className="w-full shadow-lg shadow-citics-turquoise/20">
                    Bắt đầu bài kiểm tra
                </Button>
            </Card>
        </motion.div>
    );
};
