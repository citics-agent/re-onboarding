import React from 'react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { motion } from 'framer-motion';

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
            <Card className="max-w-md w-full mx-auto">
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
                        <div className="text-center p-4">
                            <p className="text-citics-turquoise text-lg font-semibold">📑 {content.slides.length} Slides</p>
                            <p className="text-xs text-citics-lavender/50 mt-2">(Placeholder for Slides Viewer)</p>
                        </div>
                    )}
                </div>

                <Button onClick={onStartQuiz} className="w-full shadow-lg shadow-citics-turquoise/20">
                    Bắt đầu bài kiểm tra
                </Button>
            </Card>
        </motion.div>
    );
};
