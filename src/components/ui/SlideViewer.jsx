import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Maximize, Minimize } from 'lucide-react';
import { Button } from './Button';

export const SlideViewer = ({ slides }) => {
    const [[page, direction], setPage] = useState([0, 0]);
    const [isFullscreen, setIsFullscreen] = useState(false);
    const containerRef = useRef(null);

    // We only have 3 images, but we page through them infinitely
    const imageIndex = Math.abs(page % slides.length);

    if (!slides || slides.length === 0) return null;

    useEffect(() => {
        const handleFullscreenChange = () => {
            setIsFullscreen(!!document.fullscreenElement);
        };

        document.addEventListener('fullscreenchange', handleFullscreenChange);
        return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
    }, []);

    const toggleFullscreen = () => {
        if (!document.fullscreenElement) {
            containerRef.current?.requestFullscreen().catch(err => {
                console.error(`Error attempting to enable fullscreen: ${err.message}`);
            });
        } else {
            document.exitFullscreen();
        }
    };

    const paginate = (newDirection) => {
        setPage([page + newDirection, newDirection]);
    };

    const variants = {
        enter: (direction) => ({
            x: direction > 0 ? 1000 : -1000,
            opacity: 0
        }),
        center: {
            zIndex: 1,
            x: 0,
            opacity: 1
        },
        exit: (direction) => ({
            zIndex: 0,
            x: direction < 0 ? 1000 : -1000,
            opacity: 0
        })
    };

    const swipeConfidenceThreshold = 10000;
    const swipePower = (offset, velocity) => {
        return Math.abs(offset) * velocity;
    };

    return (
        <div
            ref={containerRef}
            className={`relative w-full bg-black/90 rounded-xl overflow-hidden border border-white/10 shadow-2xl group transition-all duration-300 ${isFullscreen ? 'h-screen w-screen flex items-center justify-center rounded-none border-none' : 'aspect-video'}`}
        >
            <div className={`relative w-full h-full flex items-center justify-center overflow-hidden`}>
                <AnimatePresence initial={false} custom={direction}>
                    <motion.img
                        key={page}
                        src={slides[imageIndex]}
                        custom={direction}
                        variants={variants}
                        initial="enter"
                        animate="center"
                        exit="exit"
                        transition={{
                            x: { type: "spring", stiffness: 300, damping: 30 },
                            opacity: { duration: 0.2 }
                        }}
                        drag="x"
                        dragConstraints={{ left: 0, right: 0 }}
                        dragElastic={1}
                        onDragEnd={(e, { offset, velocity }) => {
                            const swipe = swipePower(offset.x, velocity.x);

                            if (swipe < -swipeConfidenceThreshold) {
                                paginate(1);
                            } else if (swipe > swipeConfidenceThreshold) {
                                paginate(-1);
                            }
                        }}
                        className={`absolute inset-0 w-full h-full object-contain`}
                    />
                </AnimatePresence>
            </div>

            {/* Navigation Buttons */}
            <div className="absolute inset-0 flex items-center justify-between p-4 opacity-0 group-hover:opacity-100 transition-opacity z-10 pointer-events-none">
                <button
                    onClick={() => paginate(-1)}
                    className="p-2 rounded-full bg-black/50 hover:bg-white/20 text-white backdrop-blur-sm transition-colors pointer-events-auto"
                >
                    <ChevronLeft size={24} />
                </button>
                <button
                    onClick={() => paginate(1)}
                    className="p-2 rounded-full bg-black/50 hover:bg-white/20 text-white backdrop-blur-sm transition-colors pointer-events-auto"
                >
                    <ChevronRight size={24} />
                </button>
            </div>

            {/* Pagination Indicators */}
            <div className={`absolute left-0 right-0 flex justify-center gap-2 z-10 ${isFullscreen ? 'bottom-10' : 'bottom-4'}`}>
                {slides.map((_, index) => (
                    <button
                        key={index}
                        onClick={() => {
                            const diff = index - imageIndex;
                            if (diff !== 0) paginate(diff);
                        }}
                        className={`w-2 h-2 rounded-full transition-all ${index === imageIndex ? 'bg-white w-6' : 'bg-white/50'}`}
                    />
                ))}
            </div>

            {/* Controls Bar (Counter + Fullscreen) */}
            <div className="absolute top-4 right-4 flex items-center gap-2 z-10">
                <div className="bg-black/60 px-3 py-1 rounded-full text-xs text-white/80 backdrop-blur-md border border-white/10">
                    {imageIndex + 1} / {slides.length}
                </div>
                <button
                    onClick={toggleFullscreen}
                    className="p-1.5 rounded-full bg-black/60 text-white/80 hover:text-white hover:bg-white/20 backdrop-blur-md border border-white/10 transition-colors"
                    title={isFullscreen ? "Thoát toàn màn hình" : "Toàn màn hình"}
                >
                    {isFullscreen ? <Minimize size={16} /> : <Maximize size={16} />}
                </button>
            </div>
        </div>
    );
};
