import React from 'react';

export const AppLayout = ({ children }) => {
    return (
        <div className="min-h-screen bg-citics-blue text-white font-sans antialiased overflow-x-hidden">
            {/* Abstract Background Shapes (CSS only for performance) */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-[-20%] right-[-10%] w-[600px] h-[600px] rounded-full bg-citics-turquoise opacity-20 blur-[120px]" />
                <div className="absolute bottom-[-10%] left-[-20%] w-[500px] h-[500px] rounded-full bg-citics-lavender opacity-10 blur-[100px]" />
            </div>

            <div className="relative z-10 min-h-screen flex flex-col items-center justify-center p-4">
                <header className="absolute top-0 left-0 w-full p-6 flex justify-between items-center">
                    <img src="/logo.png" alt="Citics" className="h-8 md:h-10 object-contain" />
                    <div className="text-xs text-citics-lavender uppercase tracking-widest font-semibold opacity-80">Re-Onboarding</div>
                </header>

                <main className="w-full max-w-4xl pt-20 pb-12 flex flex-col items-center">
                    {children}
                </main>

                <footer className="absolute bottom-4 text-citics-lavender text-xs text-center w-full opacity-60">
                    &copy; 2026 Citics. All rights reserved.
                </footer>
            </div>
        </div>
    );
};
