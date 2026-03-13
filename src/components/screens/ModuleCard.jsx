import React from 'react';
import ReactDOM from 'react-dom';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { motion } from 'framer-motion';
import { SlideViewer } from '../ui/SlideViewer';
import { HelpCircle, Star, Maximize, X } from 'lucide-react';

const PdfViewer = ({ url, title }) => {
    const [isFullscreen, setIsFullscreen] = React.useState(false);
    const pdfUrl = `${url}#pagemode=none&view=FitH&toolbar=0&navpanes=0`;

    const fullscreenModal = isFullscreen && ReactDOM.createPortal(
        <div
            className="fixed inset-0 z-[9999] bg-black flex flex-col touch-none"
            style={{ width: '100vw', height: '100dvh' }}
        >
            {/* Header bar */}
            <div className="flex items-center justify-between px-4 py-3 bg-black/80 backdrop-blur-sm shrink-0">
                <span className="text-white/70 text-sm font-medium truncate mr-4">{title}</span>
                <button
                    onClick={() => setIsFullscreen(false)}
                    className="p-2 rounded-full bg-white/10 hover:bg-white/25 text-white transition-colors"
                >
                    <X size={20} />
                </button>
            </div>
            {/* PDF iframe — takes remaining space, hide bottom toolbar */}
            <div className="flex-1 w-full relative overflow-hidden">
                <iframe
                    className="w-full bg-white"
                    style={{ height: 'calc(100% + 40px)' }}
                    src={pdfUrl}
                    title={title}
                    frameBorder="0"
                    allowFullScreen
                />
            </div>
        </div>,
        document.body
    );

    return (
        <>
            <div className="relative bg-slate-100 border border-slate-200 rounded-xl overflow-hidden group">
                {/* Taller aspect ratio on mobile for portrait PDFs, 16:9 on desktop */}
                <div className="aspect-[4/3] md:aspect-video overflow-hidden">
                    <iframe
                        className="w-full"
                        style={{ height: 'calc(100% + 40px)' }}
                        src={pdfUrl}
                        title={title}
                        frameBorder="0"
                        allowFullScreen
                    />
                </div>

                {/* Fullscreen button overlay */}
                <button
                    onClick={() => setIsFullscreen(true)}
                    className="absolute top-3 right-3 flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/90 hover:bg-white text-slate-700 backdrop-blur-md border border-slate-200 shadow-sm transition-colors z-10 text-xs font-medium"
                >
                    <Maximize size={14} />
                    <span className="hidden sm:inline">Toàn màn hình</span>
                </button>

                {/* Mobile tap hint */}
                <div
                    onClick={() => setIsFullscreen(true)}
                    className="absolute inset-0 flex items-end justify-center pb-4 bg-gradient-to-t from-black/30 via-transparent to-transparent opacity-0 group-hover:opacity-100 md:hidden active:opacity-100 transition-opacity cursor-pointer z-10 pointer-events-auto"
                >
                    <span className="px-4 py-2 rounded-full bg-white/90 text-slate-700 text-xs font-semibold shadow-lg flex items-center gap-1.5">
                        <Maximize size={14} />
                        Nhấn để xem toàn màn hình
                    </span>
                </div>
            </div>
            {fullscreenModal}
        </>
    );
};

export const ModuleCard = ({ module, onStartQuiz, onBack }) => {
    const { id, title, description, content: rawContent, quiz } = module;
    // Resolve content URLs against Vite base path (for GitHub Pages sub-path)
    const content = { ...rawContent };
    if (content.url && content.url.startsWith('/')) {
        content.url = import.meta.env.BASE_URL + content.url.slice(1);
    }
    if (content.slides) {
        content.slides = content.slides.map(s => s.startsWith('/') ? import.meta.env.BASE_URL + s.slice(1) : s);
    }
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


                {/* Header */}
                <div className="mb-4 pr-16">
                    <h2 className="text-xl md:text-2xl font-black text-slate-900 leading-tight">{title}</h2>
                    <p className="text-slate-600 font-medium mt-1.5 text-sm leading-relaxed">{description}</p>
                </div>

                {/* Meta pills */}
                <div className="flex flex-wrap gap-2 mb-3">
                    <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-50 border border-slate-200 text-xs font-semibold text-slate-600">
                        <HelpCircle className="w-3 h-3 text-citics-blue" />
                        {questionCount} câu hỏi
                    </span>
                    <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-50 border border-slate-200 text-xs font-semibold text-slate-600">
                        <Star className="w-3 h-3 text-amber-500" />
                        Yêu cầu {Math.ceil(questionCount * 0.8)}/{questionCount} để qua
                    </span>
                </div>

                {/* Content Area */}
                <div className="mb-4 rounded-xl overflow-hidden border border-slate-100 shadow-sm">
                    {content.type === 'pdf' ? (
                        <PdfViewer url={content.url} title={title} />
                    ) : content.type === 'video' ? (
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
