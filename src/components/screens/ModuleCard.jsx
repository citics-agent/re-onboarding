import React from 'react';
import ReactDOM from 'react-dom';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { motion, AnimatePresence } from 'framer-motion';
import { SlideViewer } from '../ui/SlideViewer';
import { HelpCircle, Star, Maximize, X, Smartphone, RotateCcw } from 'lucide-react';

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

export const ModuleCard = ({ module, onStartQuiz, onBack, isRetry = false }) => {
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

    // Training condition: show "Bắt đầu" only after 75% pages viewed OR 3 min elapsed
    // Anti-cheat: each slide must be viewed for at least 2s to count, and flipping faster than 1s apart doesn't register
    // Time fallback only activates after viewing at least 25% of slides (prevents idle waiting)
    const totalSlides = content.slides?.length || 0;
    const threshold = Math.ceil(totalSlides * 0.75);
    const [validPages, setValidPages] = React.useState(new Set([0])); // anti-cheat: 2s dwell per page
    const [visitedPages, setVisitedPages] = React.useState(new Set([0])); // raw page visits (anti-idle)
    const [timeElapsed, setTimeElapsed] = React.useState(false);
    const lastFlipTime = React.useRef(Date.now());
    const dwellTimer = React.useRef(null);
    const currentPage = React.useRef(0);

    const MIN_DWELL_MS = 2000;  // must stay on a slide at least 2s for it to count
    const MIN_FLIP_MS = 1000;   // ignore flips faster than 1s apart
    const FALLBACK_MS = 3 * 60 * 1000; // 3 min for first attempt
    const RETRY_MS = 60 * 1000;        // 1 min on retry
    const displayTime = isRetry ? RETRY_MS : FALLBACK_MS;
    const [remainingSeconds, setRemainingSeconds] = React.useState(displayTime / 1000);

    React.useEffect(() => {
        // Start dwell timer for first slide
        dwellTimer.current = setTimeout(() => {
            setValidPages(prev => new Set(prev).add(0));
        }, MIN_DWELL_MS);
        // Start the time fallback immediately
        const timerId = setTimeout(() => setTimeElapsed(true), displayTime);
        // Countdown ticker
        const interval = setInterval(() => {
            setRemainingSeconds(prev => {
                if (prev <= 1) { clearInterval(interval); return 0; }
                return prev - 1;
            });
        }, 1000);
        return () => { clearTimeout(dwellTimer.current); clearTimeout(timerId); clearInterval(interval); };
    }, []);

    const handlePageChange = (pageIndex) => {
        const now = Date.now();
        const timeSinceLastFlip = now - lastFlipTime.current;

        // Always count raw page visit (for anti-idle check)
        setVisitedPages(prev => new Set(prev).add(pageIndex));

        // Clear previous dwell timer
        clearTimeout(dwellTimer.current);

        // Ignore rapid flipping (anti-cheat)
        if (timeSinceLastFlip < MIN_FLIP_MS) {
            lastFlipTime.current = now;
            currentPage.current = pageIndex;
            // Still start dwell timer for the new page
            dwellTimer.current = setTimeout(() => {
                setValidPages(prev => new Set(prev).add(pageIndex));
            }, MIN_DWELL_MS);
            return;
        }

        // If user stayed long enough on the previous page, count it
        if (timeSinceLastFlip >= MIN_DWELL_MS) {
            setValidPages(prev => new Set(prev).add(currentPage.current));
        }

        lastFlipTime.current = now;
        currentPage.current = pageIndex;

        // Start dwell timer for the new page
        dwellTimer.current = setTimeout(() => {
            setValidPages(prev => new Set(prev).add(pageIndex));
        }, MIN_DWELL_MS);
    };

    const minReadPages = Math.ceil(totalSlides * 0.5);
    const hasReadEnough = visitedPages.size >= minReadPages;
    const canStart = totalSlides === 0
        || (isRetry
            ? (timeElapsed && hasReadEnough)
            : ((timeElapsed && hasReadEnough) || validPages.size >= threshold));

    // Fullscreen tip — show once on mobile
    const [showTip, setShowTip] = React.useState(
        typeof window !== 'undefined' && window.innerWidth < 768
    );
    React.useEffect(() => {
        if (showTip) {
            const t = setTimeout(() => setShowTip(false), 6000);
            return () => clearTimeout(t);
        }
    }, [showTip]);

    const [hint, setHint] = React.useState(null);
    const hintTimer = React.useRef(null);

    const handleLockedClick = () => {
        clearTimeout(hintTimer.current);
        let msg;
        if (!hasReadEnough && remainingSeconds > 0) {
            msg = `Hãy xem thêm tài liệu nhé! (${visitedPages.size}/${totalSlides} trang)`;
        } else if (!hasReadEnough) {
            msg = `Bạn cần xem ít nhất ${minReadPages} trang để tiếp tục`;
        } else {
            msg = `Còn ${Math.floor(remainingSeconds / 60)}:${String(remainingSeconds % 60).padStart(2, '0')} nữa thôi, đọc thêm nhé!`;
        }
        setHint(msg);
        hintTimer.current = setTimeout(() => setHint(null), 3000);
    };

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

                {/* Fullscreen tip */}
                <AnimatePresence>
                    {showTip && (
                        <motion.div
                            initial={{ opacity: 0, y: -8 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -8 }}
                            className="mb-3 px-4 py-3 rounded-lg bg-citics-blue/5 border border-citics-blue/20 flex items-center gap-3 cursor-pointer"
                            onClick={() => setShowTip(false)}
                        >
                            <div className="flex items-center gap-1.5 text-citics-blue">
                                <Maximize size={16} />
                                <span className="text-lg">+</span>
                                <RotateCcw size={16} />
                            </div>
                            <p className="text-xs font-medium text-slate-600">
                                Mở <span className="text-citics-blue font-bold">toàn màn hình</span> và <span className="text-citics-blue font-bold">xoay ngang</span> để xem tài liệu tốt nhất nhé!
                            </p>
                        </motion.div>
                    )}
                </AnimatePresence>

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
                            <SlideViewer
                                slides={content.slides}
                                onPageChange={handlePageChange}
                                countdown={!canStart ? `${Math.floor(remainingSeconds / 60)}:${String(remainingSeconds % 60).padStart(2, '0')}` : null}
                            />
                        ) : (
                            <div className="aspect-video bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-center text-slate-400 font-medium text-sm">
                                Nội dung sẽ được cập nhật
                            </div>
                        )
                    )}
                </div>

                {/* Hint popup */}
                <AnimatePresence>
                    {hint && (
                        <motion.div
                            initial={{ opacity: 0, y: 8 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: 8 }}
                            className="mb-2 px-4 py-2.5 rounded-lg bg-amber-50 border border-amber-200 text-amber-700 text-xs font-medium text-center"
                        >
                            {hint}
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* CTA */}
                <div className="flex gap-3">
                    <Button type="button" variant="outline" onClick={onBack} className="w-1/3 text-slate-600 border-slate-200 hover:bg-slate-50 px-2 text-sm md:text-base">
                        Quay lại
                    </Button>
                    <Button
                        onClick={canStart ? onStartQuiz : handleLockedClick}
                        className={`w-2/3 font-semibold group px-2 text-sm md:text-base transition-colors ${canStart ? 'shadow-lg shadow-citics-turquoise/20' : 'bg-slate-300 text-slate-500'}`}
                    >
                        {canStart
                            ? <>Bắt đầu <span className="ml-2 group-hover:translate-x-1 inline-block transition-transform">→</span></>
                            : `${isRetry ? 'Đọc lại tài liệu' : 'Đọc tài liệu'} (${Math.floor(remainingSeconds / 60)}:${String(remainingSeconds % 60).padStart(2, '0')})`
                        }
                    </Button>
                </div>
            </Card>
        </motion.div>
    );
};
