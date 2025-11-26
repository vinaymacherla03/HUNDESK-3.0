
import React from 'react';
import { motion } from 'framer-motion';

const IconWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
    <div className="relative w-8 h-8 flex items-center justify-center transition-transform hover:scale-110">
        {children}
    </div>
);

export const AiOrbIcon = () => (
    <IconWrapper>
        <div className="w-6 h-6 rounded-full bg-gradient-to-br from-fuchsia-400 to-violet-600 shadow-lg shadow-violet-200 flex items-center justify-center">
            <div className="w-2 h-2 bg-white/50 rounded-full blur-[1px]" />
        </div>
    </IconWrapper>
);

export const TargetIcon = () => (
    <IconWrapper>
        <div className="w-6 h-6 rounded-full border-2 border-emerald-500 flex items-center justify-center bg-emerald-50">
            <div className="w-2 h-2 rounded-full bg-emerald-500 shadow-sm" />
        </div>
    </IconWrapper>
);

export const TemplatesIcon = () => (
    <IconWrapper>
        <div className="w-5 h-6 bg-blue-500 rounded-md shadow-lg rotate-[-6deg] border border-white/20 absolute" />
        <div className="w-5 h-6 bg-white border border-slate-200 rounded-md shadow-sm flex flex-col gap-1 p-1 relative z-10">
            <div className="h-1 w-full bg-slate-100 rounded-full" />
            <div className="h-1 w-2/3 bg-slate-100 rounded-full" />
        </div>
    </IconWrapper>
);

export const StyleIcon = () => (
    <IconWrapper>
        <div className="w-6 h-6 rounded-full bg-gradient-to-tr from-amber-300 to-orange-500 shadow-md flex items-center justify-center text-white font-serif font-bold text-xs">
            Aa
        </div>
    </IconWrapper>
);

export const SectionsIcon = () => (
    <IconWrapper>
        <div className="flex flex-col gap-0.5 w-5">
            <div className="h-1.5 w-full bg-slate-300 rounded-sm" />
            <div className="h-1.5 w-full bg-slate-800 rounded-sm shadow-sm" />
            <div className="h-1.5 w-full bg-slate-300 rounded-sm" />
        </div>
    </IconWrapper>
);