
import React from 'react';
import { motion } from 'framer-motion';

interface FinalCTAProps {
    onGetStarted: () => void;
}

const FinalCTA: React.FC<FinalCTAProps> = ({ onGetStarted }) => {
    return (
        <section className="py-24 bg-[#f2f1ed] relative overflow-hidden">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="relative rounded-[2.5rem] bg-[#0F172A] overflow-hidden px-6 py-20 sm:px-16 sm:py-24 text-center shadow-2xl shadow-slate-900/20 ring-1 ring-white/10">
                    {/* Background Effects */}
                    <div className="absolute inset-0 w-full h-full pointer-events-none">
                        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-blue-600/20 rounded-full blur-[120px]" />
                        <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-purple-600/20 rounded-full blur-[100px]" />
                        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-soft-light"></div>
                    </div>

                    <div className="relative z-10 max-w-3xl mx-auto">
                        <motion.h2 
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            className="text-4xl sm:text-5xl md:text-6xl font-display font-bold text-white tracking-tight mb-6"
                        >
                            Ready to Land Your <br className="hidden sm:block" />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-200 via-white to-purple-200">Dream Job?</span>
                        </motion.h2>
                        
                        <motion.p 
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.1 }}
                            className="text-lg sm:text-xl text-slate-300 mb-10 leading-relaxed font-light"
                        >
                            Stop wrestling with formatting and start building a resume that opens doors. Get started for free and see the AI difference.
                        </motion.p>

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.2 }}
                            className="flex flex-col sm:flex-row items-center justify-center gap-4"
                        >
                            <button
                                onClick={onGetStarted}
                                className="w-full sm:w-auto px-8 py-4 bg-white text-slate-900 rounded-full font-bold text-lg hover:bg-blue-50 transition-all transform hover:scale-105 hover:shadow-xl hover:shadow-white/10 flex items-center justify-center gap-2 group"
                            >
                                Build My Resume Free
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                                    </svg>
                            </button>
                            <button 
                                onClick={onGetStarted} 
                                className="w-full sm:w-auto px-8 py-4 bg-slate-800/50 text-white border border-slate-700 rounded-full font-bold text-lg hover:bg-slate-800 transition-all backdrop-blur-sm"
                            >
                                View Examples
                            </button>
                        </motion.div>

                        <div className="mt-10 flex flex-wrap items-center justify-center gap-6 text-sm text-slate-400 font-medium">
                            <div className="flex items-center gap-2">
                                <div className="p-0.5 bg-emerald-500/20 rounded-full">
                                    <svg className="w-4 h-4 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
                                </div>
                                No credit card required
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="p-0.5 bg-emerald-500/20 rounded-full">
                                    <svg className="w-4 h-4 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
                                </div>
                                ATS-Friendly
                            </div>
                             <div className="flex items-center gap-2">
                                <div className="p-0.5 bg-emerald-500/20 rounded-full">
                                    <svg className="w-4 h-4 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
                                </div>
                                Secure & Private
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default FinalCTA;
