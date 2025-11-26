
import React from 'react';
import { motion } from 'framer-motion';
import SparkleIcon from './icons/SparkleIcon';

interface FeaturesProps {
    // onGetStarted: () => void; // Removed, handled by parent LandingPage
}

const FeatureCard: React.FC<{
    title: string;
    description: string;
    icon: React.ReactNode;
    delay: number;
}> = ({ title, description, icon, delay }) => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ delay, duration: 0.5 }}
            className="group relative p-8 bg-white rounded-[2.5rem] border border-slate-200 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_20px_40px_rgb(0,0,0,0.08)] transition-all duration-500 hover:-translate-y-2 overflow-hidden"
        >
            {/* Hover Gradient Background */}
            <div className="absolute inset-0 bg-gradient-to-br from-violet-50/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            
            {/* Top Decorative Line */}
            <div className="absolute top-0 left-8 right-8 h-[2px] bg-gradient-to-r from-transparent via-slate-200 to-transparent group-hover:via-violet-300 transition-colors duration-500" />

            <div className="relative z-10 flex flex-col h-full">
                {/* Icon */}
                <div className="w-16 h-16 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-center mb-8 group-hover:scale-110 group-hover:rotate-3 group-hover:bg-white group-hover:shadow-lg group-hover:border-violet-100 transition-all duration-300 text-slate-600 group-hover:text-violet-600">
                    {icon}
                </div>
                
                {/* Text */}
                <h3 className="text-xl font-display font-bold text-slate-900 mb-4 group-hover:text-violet-900 transition-colors">
                    {title}
                </h3>
                <p className="text-slate-500 leading-relaxed text-base font-medium">
                    {description}
                </p>

                {/* Bottom Learn More */}
                <div className="mt-auto pt-6 flex items-center gap-2 text-sm font-bold text-violet-600 opacity-0 -translate-x-4 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300">
                    Learn more
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
                </div>
            </div>
        </motion.div>
    );
};

const Features: React.FC = () => { 
    return (
        <section className="py-32 bg-[#f2f1ed] relative overflow-hidden" id="features">
            {/* Background Decoration */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1000px] h-[600px] bg-blue-100/30 rounded-full blur-[120px] pointer-events-none" />

            <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <div className="text-center max-w-3xl mx-auto mb-24">
                    <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white border border-slate-200 text-slate-600 text-xs font-bold uppercase tracking-wider mb-8 shadow-sm">
                        <SparkleIcon className="w-3.5 h-3.5 text-violet-500" />
                        Why HuntDesk?
                    </div>
                    <h2 className="text-4xl md:text-5xl font-display font-bold text-slate-900 mb-6 tracking-tight">
                        Supercharge your <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-600 to-blue-600">job search</span>.
                    </h2>
                    <p className="text-xl text-slate-500 leading-relaxed font-light">
                        We combine elite AI writing technology with premium design tools to give you an unfair advantage in the market.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-7xl mx-auto">
                    <FeatureCard 
                        title="AI Writer & Rewriter"
                        description="Transform generic bullet points into executive-level achievements. Our AI analyzes your experience and suggests forceful, impact-driven language automatically."
                        delay={0}
                        icon={<svg xmlns="http://www.w3.org/2000/svg" className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>}
                    />
                    <FeatureCard 
                        title="ATS Intelligence"
                        description="Don't get filtered out by bots. We analyze job descriptions to identify missing keywords and skills, giving you a match score and fix suggestions before you apply."
                        delay={0.1}
                        icon={<svg xmlns="http://www.w3.org/2000/svg" className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>}
                    />
                    <FeatureCard 
                        title="Pipeline Tracker"
                        description="Visualize your entire job search. Organize applications, interviews, and offers in a drag-and-drop Kanban board so you never miss a follow-up opportunity."
                        delay={0.2}
                        icon={<svg xmlns="http://www.w3.org/2000/svg" className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M9 17V7m0 10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h2a2 2 0 012 2m0 10a2 2 0 002 2h2a2 2 0 002-2M9 7a2 2 0 012-2h2a2 2 0 012 2m0 10V7m0 10a2 2 0 002 2h2a2 2 0 00-2-2h-2a2 2 0 00-2 2" /></svg>}
                    />
                </div>
            </div>
        </section>
    );
};

export default Features;
