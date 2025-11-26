
import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ResumeData } from '../../types';
import { generateAgentSuggestion, askCoachWithGoogleSearch } from '../../services/geminiService';
import AgentIcon from '../icons/AgentIcon';
import SparkleIcon from '../icons/SparkleIcon';

interface AiAgentProps {
    isOpen: boolean;
    onClose: () => void;
    currentStepKey: string;
    resumeData: ResumeData;
    onApplySuggestion: (path: string, value: any) => void;
}

interface Message {
    id: number;
    type: 'agent' | 'user' | 'system';
    text: string;
    suggestion?: { path: string, value: any };
    sources?: { uri: string; title: string }[];
}

const AiAgent: React.FC<AiAgentProps> = ({ isOpen, onClose, currentStepKey, resumeData, onApplySuggestion }) => {
    const [messages, setMessages] = useState<Message[]>([]);
    const [userInput, setUserInput] = useState('');
    const [isThinking, setIsThinking] = useState(false);
    const [loadingText, setLoadingText] = useState('Thinking...');
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(scrollToBottom, [messages, isThinking]);

    useEffect(() => {
        if (isOpen && messages.length === 0) {
            setMessages([{ 
                id: Date.now(), 
                type: 'agent', 
                text: "Hello! I'm your AI Career Coach. I can help you rewrite your resume, but I can also search the web for salary data, interview questions, and company info. What do you need?" 
            }]);
        }
    }, [isOpen, messages.length]);
    
    const handleAction = async (actionType: string, context?: any) => {
        setIsThinking(true);
        setLoadingText('Drafting content...');
        try {
            switch(actionType) {
                case 'rewrite-summary':
                    const summaryResult = await generateAgentSuggestion('WRITE_SUMMARY', { resume: resumeData });
                    if (typeof summaryResult === 'string') {
                        setMessages(prev => [...prev, {
                            id: Date.now(),
                            type: 'agent',
                            text: "Here's a draft for your professional summary:",
                            suggestion: { path: 'summary', value: summaryResult }
                        }]);
                    }
                    break;
                case 'rewrite-experience-bullet':
                    if (context && context.bullet) {
                        const bulletResult = await generateAgentSuggestion('REWRITE_EXPERIENCE_BULLET_WITH_REASON', { bulletPoint: context.bullet });
                        if (typeof bulletResult === 'object' && 'rewritten' in bulletResult) {
                            setMessages(prev => [...prev, {
                                id: Date.now(),
                                type: 'agent',
                                text: "Here's a more impactful version of that bullet point:",
                                suggestion: { path: `experience[${context.expIndex}].description[${context.descIndex}]`, value: bulletResult.rewritten }
                            }]);
                        }
                    }
                    break;
                default:
                    break;
            }
        } catch (error) {
             setMessages(prev => [...prev, { 
                id: Date.now(), 
                type: 'system', 
                text: error instanceof Error ? error.message : "Sorry, an error occurred." 
            }]);
        } finally {
            setIsThinking(false);
        }
    };
    
    const handleSendMessage = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!userInput.trim() || isThinking) return;

        const userMessage: Message = { id: Date.now(), type: 'user', text: userInput };
        setMessages(prev => [...prev, userMessage]);
        setUserInput('');
        setIsThinking(true);
        setLoadingText('Searching the web...');

        try {
            const result = await askCoachWithGoogleSearch(userMessage.text);
            const agentMessage: Message = {
                id: Date.now() + 1,
                type: 'agent',
                text: result.text,
                sources: result.sources,
            };
            setMessages(prev => [...prev, agentMessage]);
        } catch (error) {
            const errorMessage: Message = {
                id: Date.now() + 1,
                type: 'system',
                text: error instanceof Error ? error.message : "An error occurred.",
            };
            setMessages(prev => [...prev, errorMessage]);
        } finally {
            setIsThinking(false);
        }
    };
    
    const renderContextualActions = () => {
        switch (currentStepKey) {
            case 'summary':
                return (
                    <button onClick={() => handleAction('rewrite-summary')} className="agent-action-button">
                        <SparkleIcon className="w-4 h-4" />
                        Write a summary based on my experience
                    </button>
                );
            case 'experience':
                return resumeData?.experience?.flatMap((exp, expIndex) =>
                    exp.description.filter(d => d.trim()).map((desc, descIndex) => (
                        <button key={`${exp.id}-${descIndex}`} onClick={() => handleAction('rewrite-experience-bullet', { bullet: desc, expIndex, descIndex })} className="agent-action-button text-left">
                           <SparkleIcon className="w-4 h-4 shrink-0" />
                           Rewrite bullet: "{desc.substring(0, 40)}..."
                        </button>
                    ))
                ) || null;
            default:
                return null;
        }
    };
    
    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0, y: 50, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 50, scale: 0.95 }}
                    transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                    className="absolute bottom-24 right-6 w-96 h-[32rem] bg-white/80 backdrop-blur-xl border border-slate-200 rounded-2xl shadow-2xl flex flex-col z-50 overflow-hidden print-hide"
                >
                    {/* Header */}
                    <header className="flex items-center justify-between p-4 border-b border-slate-200 flex-shrink-0 bg-white/50">
                        <div className="flex items-center gap-3">
                           <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary-500 to-amber-500 flex items-center justify-center shadow-sm">
                               <AgentIcon className="w-5 h-5 text-white" />
                           </div>
                            <div>
                                <h3 className="font-bold text-slate-800 text-sm leading-tight">AI Career Coach</h3>
                                <p className="text-[10px] text-slate-500 font-medium">Powered by Gemini & Google Search</p>
                            </div>
                        </div>
                        <button onClick={onClose} className="p-1 rounded-full text-slate-500 hover:bg-slate-200 transition-colors" aria-label="Close AI Coach">
                           <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" /></svg>
                        </button>
                    </header>

                    {/* Messages */}
                    <div className="flex-grow p-4 space-y-4 overflow-y-auto custom-scrollbar bg-slate-50/50">
                        {messages.map(msg => {
                             const messageBgClass = {
                                agent: 'bg-white border border-slate-200 text-slate-700 shadow-sm',
                                user: 'bg-primary-600 text-white shadow-md',
                                system: 'bg-red-50 border border-red-100 text-red-800'
                            }[msg.type];
                            return (
                                <motion.div 
                                    key={msg.id} 
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className={`flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`}
                                >
                                    <div className={`max-w-[85%] px-4 py-3 rounded-2xl text-sm ${messageBgClass} ${msg.type === 'user' ? 'rounded-br-none' : 'rounded-bl-none'}`}>
                                        <p className="whitespace-pre-wrap leading-relaxed">{msg.text}</p>
                                        
                                        {/* Sources Rendering */}
                                        {msg.sources && msg.sources.length > 0 && (
                                            <div className="mt-3 pt-3 border-t border-slate-100">
                                                <p className="text-[10px] font-bold opacity-50 mb-2 flex items-center gap-1 uppercase tracking-wider">
                                                    <svg className="w-3 h-3" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z"/></svg>
                                                    Verified Sources
                                                </p>
                                                <div className="flex flex-wrap gap-1.5">
                                                    {msg.sources.slice(0, 3).map((s, i) => (
                                                        <a key={i} href={s.uri} target="_blank" rel="noreferrer" className="flex items-center gap-1 text-[10px] bg-slate-50 px-2 py-1 rounded-md border border-slate-200 hover:bg-primary-50 hover:border-primary-200 hover:text-primary-700 transition-all truncate max-w-[180px]" title={s.title}>
                                                            <span className="truncate">{s.title}</span>
                                                            <svg className="w-2.5 h-2.5 flex-shrink-0 opacity-50" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" /></svg>
                                                        </a>
                                                    ))}
                                                </div>
                                            </div>
                                        )}

                                        {msg.suggestion && (
                                            <div className="mt-3 pt-3 border-t border-slate-200/50">
                                                <div className="text-sm italic text-slate-600 p-3 bg-slate-50 border border-slate-100 rounded-lg mb-2 relative">
                                                    <span className="absolute top-2 left-2 text-slate-300 text-2xl leading-none">"</span>
                                                    <p className="relative z-10 pl-3">{msg.suggestion.value}</p>
                                                </div>
                                                <button onClick={() => { onApplySuggestion(msg.suggestion!.path, msg.suggestion!.value); onClose(); }} className="w-full flex items-center justify-center gap-2 text-xs font-bold text-white bg-emerald-500 hover:bg-emerald-600 rounded-lg py-2 transition-all shadow-sm hover:shadow-md">
                                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>
                                                    Apply to Resume
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                </motion.div>
                            )
                        })}
                        {isThinking && (
                             <motion.div 
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="flex justify-start"
                             >
                                <div className="px-4 py-3 rounded-2xl rounded-bl-none bg-white border border-slate-200 shadow-sm flex items-center gap-3">
                                    <div className="flex gap-1">
                                        <div className="w-1.5 h-1.5 bg-primary-400 rounded-full animate-bounce [animation-delay:-0.3s]" />
                                        <div className="w-1.5 h-1.5 bg-primary-400 rounded-full animate-bounce [animation-delay:-0.15s]" />
                                        <div className="w-1.5 h-1.5 bg-primary-400 rounded-full animate-bounce" />
                                    </div>
                                    <span className="text-xs font-medium text-slate-500">{loadingText}</span>
                                </div>
                             </motion.div>
                        )}
                        <div ref={messagesEndRef} />
                    </div>

                    {/* Contextual Actions & Input */}
                    <div className="p-4 border-t border-slate-200 space-y-3 shrink-0 bg-white">
                        <div className="flex flex-wrap gap-2">
                            {renderContextualActions()}
                        </div>
                        <form onSubmit={handleSendMessage} className="flex items-center gap-2">
                            <input
                                type="text"
                                value={userInput}
                                onChange={(e) => setUserInput(e.target.value)}
                                placeholder="Ask about salary, interview tips, etc..."
                                className="flex-grow w-full text-sm px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:bg-white transition-all"
                                disabled={isThinking}
                            />
                            <button type="submit" className="p-2.5 rounded-xl bg-primary-600 hover:bg-primary-500 text-white disabled:opacity-50 shadow-md shadow-primary-200 transition-all hover:scale-105 active:scale-95" disabled={isThinking || !userInput.trim()}>
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" /></svg>
                            </button>
                        </form>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default AiAgent;
