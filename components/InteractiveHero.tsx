
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Hero3D from './Hero3D';

interface InteractiveHeroProps {
    onGetStarted: () => void;
    draftExists: boolean;
    onLoadDraft: () => void;
}

const TextCycler = () => {
    const words = ["Resumes", "Applications", "Careers"];
    const [index, setIndex] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setIndex((prev) => (prev + 1) % words.length);
        }, 3000);
        return () => clearInterval(interval);
    }, []);

    return (
        <span className="inline-block min-w-[280px] md:min-w-[400px] relative h-[1.2em] align-top text-left">
            <AnimatePresence mode="wait">
                <motion.span
                    key={index}
                    initial={{ y: 30, opacity: 0, filter: "blur(10px)" }}
                    animate={{ y: 0, opacity: 1, filter: "blur(0px)" }}
                    exit={{ y: -30, opacity: 0, filter: "blur(10px)" }}
                    transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                    className="absolute top-0 left-0 w-full text-transparent bg-clip-text bg-gradient-to-r from-violet-600 to-fuchsia-600"
                >
                    {words[index]}
                </motion.span>
            </AnimatePresence>
        </span>
    );
};

const InteractiveHero: React.FC<InteractiveHeroProps> = ({ onGetStarted, draftExists, onLoadDraft }) => {
    return (
        <section className="relative w-full bg-[#f2f1ed] overflow-hidden pt-32 pb-20 lg:pt-48 lg:pb-32 min-h-screen flex flex-col justify-center">
            {/* Ambient Background */}
            <div className="absolute inset-0 w-full h-full overflow-hidden pointer-events-none">
                <div className="absolute top-[-10%] right-[-5%] w-[50%] h-[50%] bg-blue-100/40 rounded-full blur-[120px]" />
                <div className="absolute bottom-[10%] left-[-10%] w-[40%] h-[40%] bg-violet-100/40 rounded-full blur-[120px]" />
                <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.03] mix-blend-overlay"></div>
            </div>
            
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
                    
                    {/* Left Content */}
                    <div className="lg:col-span-6 text-center lg:text-left">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6 }}
                            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/80 backdrop-blur-sm border border-slate-200 shadow-sm mb-10"
                        >
                            <span className="flex h-2 w-2 relative">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                            </span>
                            <span className="text-xs font-bold text-slate-600 tracking-wide uppercase">AI Career Command Center</span>
                        </motion.div>

                        <motion.h1
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
                            className="font-display font-bold text-5xl sm:text-6xl lg:text-7xl leading-[1.1] text-slate-900 tracking-tight mb-8"
                        >
                            Orchestrate Your <br />
                            <TextCycler />
                        </motion.h1>

                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, delay: 0.2 }}
                            className="text-slate-600 text-lg sm:text-xl leading-relaxed font-medium mb-10 max-w-lg mx-auto lg:mx-0"
                        >
                            Build a world-class resume, track every application, and land your dream job with our intelligent, all-in-one toolkit.
                        </motion.p>

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, delay: 0.3 }}
                            className="flex flex-col sm:flex-row items-center gap-4 justify-center lg:justify-start"
                        >
                            <button
                                onClick={onGetStarted}
                                className="group relative px-8 py-4 text-base font-bold rounded-2xl text-white bg-slate-900 overflow-hidden transition-all hover:scale-105 active:scale-95 shadow-xl shadow-slate-900/20 w-full sm:w-auto"
                            >
                                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 ease-in-out"></div>
                                <span className="relative flex items-center justify-center gap-2">
                                    Launch App
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 transition-transform group-hover:translate-x-1" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" /></svg>
                                </span>
                            </button>
                            
                            {draftExists && (
                                <button
                                    onClick={onLoadDraft}
                                    className="px-8 py-4 text-base font-bold text-slate-700 bg-white border border-slate-200 rounded-2xl hover:bg-slate-50 hover:border-slate-300 transition-all shadow-sm w-full sm:w-auto flex items-center justify-center gap-2"
                                >
                                    Continue Draft
                                    <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
                                </button>
                            )}
                        </motion.div>
                    </div>

                    {/* Right Visual */}
                    <div className="lg:col-span-6 relative h-[500px] sm:h-[600px] lg:h-[700px] flex items-center justify-center">
                        <Hero3D />
                    </div>
                </div>
            </div>
        </section>
    );
};

export default InteractiveHero;
