
import React, { useRef } from 'react';
import { motion, useSpring, useMotionValue, useTransform } from 'framer-motion';

// --- Sub-Components for the Scene ---

const GlassCard = ({ children, className, style }: { children: React.ReactNode; className?: string; style?: any }) => (
    <div 
        className={`bg-white/70 backdrop-blur-xl border border-white/60 shadow-[0_20px_50px_-12px_rgba(0,0,0,0.1)] rounded-3xl ${className}`}
        style={style}
    >
        {children}
    </div>
);

const Avatar = ({ src, className }: { src: string; className?: string }) => (
    <div className={`w-10 h-10 rounded-full border-2 border-white shadow-sm overflow-hidden bg-slate-100 ${className}`}>
        <img src={src} alt="Avatar" className="w-full h-full object-cover" />
    </div>
);

const MatchRing = ({ score }: { score: number }) => (
    <div className="relative w-16 h-16 flex items-center justify-center">
        <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
            <path className="text-slate-100" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="currentColor" strokeWidth="3" />
            <motion.path 
                className="text-emerald-500" 
                strokeDasharray={`${score}, 100`} 
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" 
                fill="none" 
                stroke="currentColor" 
                strokeWidth="3" 
                strokeLinecap="round"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 1.5, ease: "easeOut", delay: 0.5 }}
            />
        </svg>
        <span className="absolute text-xs font-bold text-slate-900">{score}%</span>
    </div>
);

// --- Main Component ---

const Hero3D = () => {
    const ref = useRef<HTMLDivElement>(null);
    
    // Mouse position tracking
    const x = useMotionValue(0);
    const y = useMotionValue(0);

    // Smooth spring physics for rotation
    const rotateX = useSpring(useTransform(y, [-0.5, 0.5], [10, -10]), { stiffness: 150, damping: 20 });
    const rotateY = useSpring(useTransform(x, [-0.5, 0.5], [-10, 10]), { stiffness: 150, damping: 20 });

    // Parallax shifts for different layers
    const moveX_bg = useSpring(useTransform(x, [-0.5, 0.5], [20, -20]), { stiffness: 100, damping: 30 });
    const moveY_bg = useSpring(useTransform(y, [-0.5, 0.5], [20, -20]), { stiffness: 100, damping: 30 });
    
    const moveX_fg = useSpring(useTransform(x, [-0.5, 0.5], [-40, 40]), { stiffness: 100, damping: 30 });
    const moveY_fg = useSpring(useTransform(y, [-0.5, 0.5], [-40, 40]), { stiffness: 100, damping: 30 });

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        const rect = ref.current?.getBoundingClientRect();
        if (!rect) return;
        const width = rect.width;
        const height = rect.height;
        const mouseX = e.clientX - rect.left;
        const mouseY = e.clientY - rect.top;
        const xPct = mouseX / width - 0.5;
        const yPct = mouseY / height - 0.5;
        x.set(xPct);
        y.set(yPct);
    };

    const handleMouseLeave = () => {
        x.set(0);
        y.set(0);
    };

    return (
        <div 
            ref={ref}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            className="relative w-full h-full min-h-[500px] flex items-center justify-center perspective-1000 overflow-visible"
        >
            {/* Abstract Background Decoration (Parallax Layer Back) */}
            <motion.div 
                style={{ x: moveX_bg, y: moveY_bg }}
                className="absolute inset-0 flex items-center justify-center pointer-events-none z-0"
            >
                <div className="w-[500px] h-[500px] bg-gradient-to-tr from-violet-100/50 to-blue-50/50 rounded-full blur-[80px]" />
            </motion.div>

            {/* Main Scene Container */}
            <motion.div
                style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
                className="relative w-[320px] h-[420px] sm:w-[380px] sm:h-[480px] z-10"
            >
                {/* 1. Main Profile Card (Base Layer) */}
                <GlassCard className="absolute inset-0 p-6 flex flex-col justify-between z-10">
                    {/* Card Header */}
                    <div className="flex justify-between items-start">
                        <div className="flex gap-3">
                            <Avatar src="https://i.pravatar.cc/150?u=alex" className="w-12 h-12" />
                            <div>
                                <h3 className="font-bold text-slate-900 text-lg">Alex Chen</h3>
                                <p className="text-sm text-slate-500">Senior Product Designer</p>
                            </div>
                        </div>
                        <div className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center text-slate-400">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path d="M6 10a2 2 0 11-4 0 2 2 0 014 0zM12 10a2 2 0 11-4 0 2 2 0 014 0zM16 12a2 2 0 100-4 2 2 0 000 4z" /></svg>
                        </div>
                    </div>

                    {/* Match Info */}
                    <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100 flex items-center gap-4">
                        <MatchRing score={96} />
                        <div>
                            <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Job Match</div>
                            <div className="font-bold text-slate-900">Google Inc.</div>
                            <div className="text-xs text-slate-500">UX Lead • Mountain View</div>
                        </div>
                    </div>

                    {/* Skills Tags */}
                    <div className="flex flex-wrap gap-2">
                        {['Figma', 'React', 'Motion'].map(skill => (
                            <span key={skill} className="px-3 py-1.5 rounded-lg bg-slate-100 text-slate-600 text-xs font-bold border border-slate-200">
                                {skill}
                            </span>
                        ))}
                         <span className="px-3 py-1.5 rounded-lg bg-emerald-50 text-emerald-600 text-xs font-bold border border-emerald-100">
                            +3 more
                        </span>
                    </div>

                    {/* Action Button */}
                    <div className="h-12 rounded-xl bg-slate-900 text-white flex items-center justify-center font-bold text-sm shadow-lg shadow-slate-900/20">
                        View Application
                    </div>
                </GlassCard>

                {/* 2. Floating Elements (Foreground Parallax) */}
                
                {/* Floating Notification Card */}
                <motion.div 
                    style={{ x: moveX_fg, y: moveY_fg, z: 60 }}
                    className="absolute -right-16 top-20 z-20"
                    initial={{ opacity: 0, x: 50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2, duration: 0.8 }}
                >
                    <GlassCard className="p-4 flex items-center gap-3 w-60 shadow-2xl">
                        <div className="w-10 h-10 rounded-xl bg-emerald-500 flex items-center justify-center text-white shadow-lg shadow-emerald-500/30">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                        </div>
                        <div>
                            <div className="text-xs font-bold text-emerald-600 uppercase">Offer Received</div>
                            <div className="text-sm font-bold text-slate-900">Spotify - $180k</div>
                        </div>
                    </GlassCard>
                </motion.div>

                {/* Floating Skill Badge */}
                <motion.div 
                    style={{ x: useTransform(moveX_fg, v => v * -0.5), y: useTransform(moveY_fg, v => v * -0.5 + 10), z: 40 }}
                    className="absolute -left-12 bottom-32 z-20"
                    initial={{ opacity: 0, x: -50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.4, duration: 0.8 }}
                >
                    <div className="bg-white px-4 py-2 rounded-full shadow-[0_10px_30px_-5px_rgba(0,0,0,0.1)] border border-slate-100 flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
                        <span className="text-xs font-bold text-slate-700">Resume Optimized</span>
                    </div>
                </motion.div>

                {/* Floating Avatar Group */}
                 <motion.div 
                    style={{ x: useTransform(moveX_fg, v => v * 0.8), y: useTransform(moveY_fg, v => v * 0.8 + 20), z: 30 }}
                    className="absolute -bottom-6 -right-4 z-20"
                     initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6, duration: 0.8 }}
                >
                    <div className="bg-white/80 backdrop-blur-md p-2 rounded-2xl shadow-xl border border-white/50 flex gap-[-10px]">
                         <div className="flex -space-x-2">
                            {[1, 2, 3].map((i) => (
                                <img key={i} className="w-8 h-8 rounded-full border-2 border-white" src={`https://i.pravatar.cc/100?img=${i + 20}`} alt="Recruiter" />
                            ))}
                        </div>
                        <div className="pl-3 pr-2 flex items-center text-xs font-bold text-slate-600">
                            3 Recruiters
                        </div>
                    </div>
                </motion.div>

            </motion.div>
        </div>
    );
};

export default Hero3D;
