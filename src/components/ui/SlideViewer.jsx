import React, { useState } from 'react';
import ReactDOM from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Maximize, X } from 'lucide-react';

export const SlideViewer = ({ slides }) => {
    const [[page, direction], setPage] = useState([0, 0]);
    const [isZoomed, setIsZoomed] = useState(false);

    if (!slides || slides.length === 0) return null;

    const imageIndex = Math.abs(page % slides.length);

    const paginate = (newDirection) => {
        setPage([page + newDirection, newDirection]);
    };

    const variants = {
        enter: (d) => ({ x: d > 0 ? 300 : -300, opacity: 0 }),
        center: { zIndex: 1, x: 0, opacity: 1 },
        exit: (d) => ({ zIndex: 0, x: d < 0 ? 300 : -300, opacity: 0 })
    };

    const swipePower = (offset, velocity) => Math.abs(offset) * velocity;
    const swipeThreshold = 5000;

    // ---- Fullscreen Modal via Portal (escapes overflow-hidden parent) ----
    const fullscreenModal = isZoomed && ReactDOM.createPortal(
        <div
            className="fixed inset-0 z-[9999] bg-black flex items-center justify-center touch-none"
            style={{ width: '100vw', height: '100dvh' }}
            onClick={() => setIsZoomed(false)}
        >
            {/* Close */}
            <button
                onClick={() => setIsZoomed(false)}
                className="absolute top-4 right-4 p-2 rounded-full bg-white/10 hover:bg-white/25 text-white transition-colors z-20"
            >
                <X size={24} />
            </button>

            {/* Prev */}
            <button
                onClick={(e) => { e.stopPropagation(); paginate(-1); }}
                className="absolute left-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-white/10 hover:bg-white/25 text-white transition-colors z-20"
            >
                <ChevronLeft size={30} />
            </button>

            {/* Slide Image — fills screen, respects aspect ratio */}
            <img
                src={slides[imageIndex]}
                className="max-w-full max-h-full w-auto h-auto object-contain select-none"
                style={{ maxWidth: '100vw', maxHeight: '100dvh' }}
                onClick={(e) => e.stopPropagation()}
                draggable={false}
            />

            {/* Next */}
            <button
                onClick={(e) => { e.stopPropagation(); paginate(1); }}
                className="absolute right-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-white/10 hover:bg-white/25 text-white transition-colors z-20"
            >
                <ChevronRight size={30} />
            </button>

            {/* Pagination Dots */}
            <div className="absolute bottom-6 left-0 right-0 flex justify-center gap-2 z-20">
                {slides.map((_, i) => (
                    <button
                        key={i}
                        onClick={(e) => { e.stopPropagation(); if (i !== imageIndex) paginate(i - imageIndex); }}
                        className={`h-2 rounded-full transition-all ${i === imageIndex ? 'bg-white w-6' : 'bg-white/40 w-2'}`}
                    />
                ))}
            </div>

            {/* Hint */}
            <div className="absolute bottom-16 left-0 right-0 text-center text-white/50 text-xs z-20">
                {imageIndex + 1} / {slides.length} &nbsp;·&nbsp; Nhấn ngoài để đóng
            </div>
        </div>,
        document.body  // Portal: renders directly on body, zero clipping
    );

    return (
        <>
            {/* ---- Inline Viewer ---- */}
            <div className="relative w-full bg-slate-50 rounded-xl overflow-hidden border border-slate-200 shadow-sm group aspect-video">
                <div className="relative w-full h-full flex items-center justify-center overflow-hidden">
                    <AnimatePresence initial={false} custom={direction}>
                        <motion.img
                            key={page}
                            src={slides[imageIndex]}
                            custom={direction}
                            variants={variants}
                            initial="enter"
                            animate="center"
                            exit="exit"
                            transition={{ x: { type: 'spring', stiffness: 300, damping: 30 }, opacity: { duration: 0.2 } }}
                            drag="x"
                            dragConstraints={{ left: 0, right: 0 }}
                            dragElastic={1}
                            onDragEnd={(e, { offset, velocity }) => {
                                const swipe = swipePower(offset.x, velocity.x);
                                if (swipe < -swipeThreshold) paginate(1);
                                else if (swipe > swipeThreshold) paginate(-1);
                            }}
                            className="absolute inset-0 w-full h-full object-contain cursor-zoom-in"
                            onClick={() => setIsZoomed(true)}
                        />
                    </AnimatePresence>
                </div>

                {/* Navigation arrows (hover on desktop) */}
                <div className="absolute inset-0 flex items-center justify-between p-3 opacity-0 group-hover:opacity-100 transition-opacity z-10 pointer-events-none">
                    <button onClick={() => paginate(-1)} className="p-2 rounded-full bg-white/80 hover:bg-white text-slate-700 backdrop-blur-sm transition-colors pointer-events-auto border border-slate-200 shadow-sm">
                        <ChevronLeft size={22} />
                    </button>
                    <button onClick={() => paginate(1)} className="p-2 rounded-full bg-white/80 hover:bg-white text-slate-700 backdrop-blur-sm transition-colors pointer-events-auto border border-slate-200 shadow-sm">
                        <ChevronRight size={22} />
                    </button>
                </div>

                {/* Counter & Expand button */}
                <div className="absolute top-3 right-3 flex items-center gap-2 z-10">
                    <div className="bg-white/80 px-2.5 py-1 rounded-full text-xs font-medium text-slate-700 backdrop-blur-md border border-slate-200 shadow-sm">
                        {imageIndex + 1} / {slides.length}
                    </div>
                    <button
                        onClick={() => setIsZoomed(true)}
                        className="p-1.5 rounded-full bg-white/80 text-slate-600 hover:text-slate-900 hover:bg-white backdrop-blur-md border border-slate-200 shadow-sm transition-colors"
                        title="Xem toàn màn hình"
                    >
                        <Maximize size={14} />
                    </button>
                </div>

                {/* Pagination dots */}
                <div className="absolute bottom-3 left-0 right-0 flex justify-center gap-2 z-10">
                    {slides.map((_, i) => (
                        <button
                            key={i}
                            onClick={() => { const diff = i - imageIndex; if (diff !== 0) paginate(diff); }}
                            className={`h-1 rounded-full transition-all ${i === imageIndex ? 'bg-slate-600 w-3' : 'bg-slate-300 w-1'}`}
                        />
                    ))}
                </div>
            </div>

            {/* Portal-based fullscreen modal */}
            {fullscreenModal}
        </>
    );
};
