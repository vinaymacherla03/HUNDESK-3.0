
import React from 'react';
import { motion } from 'framer-motion';

const Pricing: React.FC = () => {
    return (
        <section className="py-24 bg-[#F2F1ED] border-t border-slate-200" id="pricing">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center max-w-3xl mx-auto mb-16">
                    <h2 className="text-4xl font-display font-bold text-slate-900 mb-4">
                        Simple, transparent pricing.
                    </h2>
                    <p className="text-lg text-slate-600">
                        Invest in your career for less than the price of a lunch.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
                    {/* Free Tier */}
                    <div className="bg-white rounded-2xl p-8 shadow-sm border border-slate-200 hover:shadow-md transition-shadow flex flex-col">
                        <h3 className="text-xl font-display font-bold text-slate-900">Starter</h3>
                        <div className="my-6">
                            <span className="text-5xl font-display font-bold text-slate-900">$0</span>
                            <span className="text-slate-500 ml-1">/ forever</span>
                        </div>
                        <p className="text-slate-600 text-sm mb-8 font-medium">Perfect for building your first optimized resume.</p>
                        <button className="w-full py-3 px-4 bg-white border-2 border-slate-900 text-slate-900 font-bold rounded-xl hover:bg-slate-50 transition-colors">
                            Get Started
                        </button>
                        <ul className="mt-8 space-y-4 text-sm text-slate-600">
                            <li className="flex items-center gap-3">
                                <svg className="w-5 h-5 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                                1 Resume
                            </li>
                            <li className="flex items-center gap-3">
                                <svg className="w-5 h-5 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                                Basic Templates
                            </li>
                            <li className="flex items-center gap-3">
                                <svg className="w-5 h-5 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                                PDF Download
                            </li>
                        </ul>
                    </div>

                    {/* Pro Tier */}
                    <motion.div 
                        whileHover={{ y: -8 }}
                        className="bg-slate-900 rounded-2xl p-8 shadow-xl shadow-slate-900/20 border border-slate-800 flex flex-col relative overflow-hidden"
                    >
                        <div className="absolute top-0 right-0 bg-indigo-500 text-white text-[10px] font-bold px-3 py-1 rounded-bl-xl uppercase tracking-wider">
                            Most Popular
                        </div>
                        <h3 className="text-xl font-display font-bold text-white">Professional</h3>
                        <div className="my-6">
                            <span className="text-5xl font-display font-bold text-white">$12</span>
                            <span className="text-slate-400 ml-1">/ month</span>
                        </div>
                        <p className="text-slate-400 text-sm mb-8 font-medium">Full access to AI tools and unlimited resumes.</p>
                        <button className="w-full py-3 px-4 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-500 transition-colors shadow-lg shadow-indigo-500/30">
                            Start Free Trial
                        </button>
                        <ul className="mt-8 space-y-4 text-sm text-slate-300">
                            <li className="flex items-center gap-3">
                                <svg className="w-5 h-5 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                                Unlimited Resumes
                            </li>
                            <li className="flex items-center gap-3">
                                <svg className="w-5 h-5 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                                AI Rewrite & Optimization
                            </li>
                            <li className="flex items-center gap-3">
                                <svg className="w-5 h-5 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                                Job Tracker & Board
                            </li>
                            <li className="flex items-center gap-3">
                                <svg className="w-5 h-5 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                                Cover Letter Generator
                            </li>
                        </ul>
                    </motion.div>

                    {/* Lifetime Tier */}
                    <div className="bg-white rounded-2xl p-8 shadow-sm border border-slate-200 hover:shadow-md transition-shadow flex flex-col">
                        <h3 className="text-xl font-display font-bold text-slate-900">Lifetime</h3>
                        <div className="my-6">
                            <span className="text-5xl font-display font-bold text-slate-900">$149</span>
                            <span className="text-slate-500 ml-1">/ once</span>
                        </div>
                        <p className="text-slate-600 text-sm mb-8 font-medium">Pay once, own it forever. Includes all future updates.</p>
                        <button className="w-full py-3 px-4 bg-white border-2 border-slate-200 text-slate-600 font-bold rounded-xl hover:border-slate-900 hover:text-slate-900 transition-colors">
                            Get Lifetime
                        </button>
                        <ul className="mt-8 space-y-4 text-sm text-slate-600">
                            <li className="flex items-center gap-3">
                                <svg className="w-5 h-5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                                Everything in Pro
                            </li>
                            <li className="flex items-center gap-3">
                                <svg className="w-5 h-5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                                Priority Support
                            </li>
                            <li className="flex items-center gap-3">
                                <svg className="w-5 h-5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                                Early Access Features
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Pricing;
