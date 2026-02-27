import React from 'react';

export const AppLayout = ({ children, progress = 0, showProgress = false }) => {
    return (
        <div className="min-h-screen bg-slate-50 text-slate-800 font-sans antialiased overflow-x-hidden">
            {/* Abstract Background - Updated for Light Theme */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-[-20%] right-[-10%] w-[600px] h-[600px] rounded-full bg-citics-blue opacity-5 blur-[120px]" />
                <div className="absolute bottom-[-10%] left-[-20%] w-[500px] h-[500px] rounded-full bg-citics-turquoise opacity-10 blur-[100px]" />
            </div>

            <div className="relative z-10 flex flex-col min-h-screen">
                {/* Header */}
                <header className="w-full px-6 pt-6 pb-4 flex justify-between items-center flex-shrink-0">
                    <img src={`${import.meta.env.BASE_URL}logo-citics.svg`} alt="Citics" className="h-12 md:h-[60px] object-contain" />
                    <div className="text-xs text-citics-blue uppercase tracking-widest font-bold opacity-80 mt-1">Re-Onboarding</div>
                </header>

                {/* Global Progress Bar */}
                {showProgress && (
                    <div className="w-full px-6 mb-4 flex-shrink-0">
                        <div className="flex justify-between text-xs text-slate-500 font-medium mb-1.5">
                            <span>Tiến trình</span>
                            <span>{progress}%</span>
                        </div>
                        <div className="w-full h-1.5 bg-slate-200 rounded-full overflow-hidden">
                            <div
                                className="h-full bg-citics-blue rounded-full transition-all duration-700 ease-out"
                                style={{ width: `${progress}%` }}
                            />
                        </div>
                    </div>
                )}

                {/* Main Content */}
                <main className="flex-1 w-full max-w-7xl mx-auto px-4 pb-16 flex flex-col items-center justify-center">
                    {children}
                </main>

                {/* Footer */}
                <footer className="py-4 text-slate-400 text-xs font-medium text-center w-full opacity-60 flex-shrink-0">
                    &copy; 2026 Citics. All rights reserved.
                </footer>
            </div>
        </div>
    );
};
