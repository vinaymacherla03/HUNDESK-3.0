
import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { askNotebook, generateAudioBrief } from '../../services/geminiService';
import SparkleIcon from '../icons/SparkleIcon';
import { decode, decodeAudioData } from '../../utils/audio';

interface JobNotebookProps {
    job: any;
    onClose: () => void;
}

const Visualizer: React.FC<{ isPlaying: boolean }> = ({ isPlaying }) => {
    return (
        <div className="flex items-center gap-1 h-8">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                <motion.div
                    key={i}
                    className="w-1 bg-violet-500 rounded-full"
                    animate={{
                        height: isPlaying ? [4, 16 + Math.random() * 16, 4] : 4,
                    }}
                    transition={{
                        duration: 0.5,
                        repeat: Infinity,
                        delay: i * 0.1,
                    }}
                />
            ))}
        </div>
    );
};

const JobNotebook: React.FC<JobNotebookProps> = ({ job, onClose }) => {
    const [activeTab, setActiveTab] = useState<'sources' | 'chat' | 'audio'>('sources');
    
    // Context State
    const [notes, setNotes] = useState(job.jobDescription || '');
    const [companyInfo, setCompanyInfo] = useState('');
    const [myResumeText, setMyResumeText] = useState(''); // Ideally pre-filled from app state
    
    // Chat State
    const [messages, setMessages] = useState<{role: 'user' | 'ai', text: string}[]>([]);
    const [input, setInput] = useState('');
    const [isThinking, setIsThinking] = useState(false);
    const chatEndRef = useRef<HTMLDivElement>(null);

    // Audio State
    const [audioState, setAudioState] = useState<'idle' | 'generating' | 'playing' | 'paused'>('idle');
    const [audioBuffer, setAudioBuffer] = useState<AudioBuffer | null>(null);
    const audioContextRef = useRef<AudioContext | null>(null);
    const sourceNodeRef = useRef<AudioBufferSourceNode | null>(null);
    const startTimeRef = useRef<number>(0);
    const pauseTimeRef = useRef<number>(0);

    // Combined Context
    const getFullContext = () => `
    JOB DESCRIPTION:
    ${notes}
    
    COMPANY INFO:
    ${companyInfo}
    
    MY RESUME TEXT:
    ${myResumeText}
    `;

    // Chat Handlers
    const handleSendMessage = async (e?: React.FormEvent) => {
        e?.preventDefault();
        if (!input.trim()) return;
        
        const userMsg = { role: 'user' as const, text: input };
        setMessages(prev => [...prev, userMsg]);
        setInput('');
        setIsThinking(true);
        
        try {
            const response = await askNotebook(getFullContext(), userMsg.text);
            setMessages(prev => [...prev, { role: 'ai', text: response }]);
        } catch (err) {
            setMessages(prev => [...prev, { role: 'ai', text: "Sorry, I couldn't process that." }]);
        } finally {
            setIsThinking(false);
        }
    };

    useEffect(() => {
        if (activeTab === 'chat') {
            chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
        }
    }, [messages, activeTab]);

    // Audio Handlers
    const handleGenerateAudio = async () => {
        setAudioState('generating');
        try {
            const base64 = await generateAudioBrief(getFullContext());
            const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
            audioContextRef.current = ctx;
            const buffer = await decodeAudioData(decode(base64), ctx, 24000, 1); // Assuming mono output from model for now or simple decode
            setAudioBuffer(buffer);
            setAudioState('paused'); // Ready to play
        } catch (err) {
            console.error(err);
            alert("Failed to generate audio brief.");
            setAudioState('idle');
        }
    };

    const playAudio = () => {
        if (!audioBuffer || !audioContextRef.current) return;
        
        const source = audioContextRef.current.createBufferSource();
        source.buffer = audioBuffer;
        source.connect(audioContextRef.current.destination);
        
        const offset = pauseTimeRef.current;
        source.start(0, offset);
        startTimeRef.current = audioContextRef.current.currentTime - offset;
        
        sourceNodeRef.current = source;
        source.onended = () => {
             if (audioContextRef.current?.currentTime && (audioContextRef.current.currentTime - startTimeRef.current >= audioBuffer.duration)) {
                 setAudioState('paused');
                 pauseTimeRef.current = 0;
             }
        };
        
        setAudioState('playing');
    };

    const pauseAudio = () => {
        if (sourceNodeRef.current && audioContextRef.current) {
            sourceNodeRef.current.stop();
            pauseTimeRef.current = audioContextRef.current.currentTime - startTimeRef.current;
            setAudioState('paused');
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm" onClick={onClose}>
            <motion.div 
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="w-full max-w-5xl h-[85vh] bg-white rounded-2xl shadow-2xl overflow-hidden flex flex-col"
                onClick={e => e.stopPropagation()}
            >
                {/* Header */}
                <div className="h-16 border-b border-slate-200 flex items-center justify-between px-6 bg-slate-50">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-slate-900 text-white rounded-lg flex items-center justify-center">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg>
                        </div>
                        <div>
                            <h2 className="text-lg font-bold text-slate-900">Job Notebook</h2>
                            <p className="text-xs text-slate-500">{job.role} @ {job.company}</p>
                        </div>
                    </div>
                    <div className="flex bg-slate-200 p-1 rounded-lg">
                        {(['sources', 'chat', 'audio'] as const).map(tab => (
                            <button 
                                key={tab}
                                onClick={() => setActiveTab(tab)}
                                className={`px-4 py-1.5 rounded-md text-xs font-bold capitalize transition-all ${activeTab === tab ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                            >
                                {tab}
                            </button>
                        ))}
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-slate-200 rounded-full transition-colors text-slate-500">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                    </button>
                </div>

                {/* Content */}
                <div className="flex-grow overflow-hidden bg-white">
                    {activeTab === 'sources' && (
                        <div className="h-full p-8 grid grid-cols-2 gap-8 overflow-y-auto">
                            <div className="space-y-4">
                                <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider">Job Description</h3>
                                <textarea 
                                    value={notes} 
                                    onChange={e => setNotes(e.target.value)}
                                    className="w-full h-96 p-4 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-700 focus:ring-2 focus:ring-indigo-500 outline-none resize-none leading-relaxed"
                                    placeholder="Paste the full job description here..."
                                />
                            </div>
                            <div className="space-y-4">
                                <div className="h-[48%] flex flex-col">
                                    <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider mb-2">Company Intelligence</h3>
                                    <textarea 
                                        value={companyInfo} 
                                        onChange={e => setCompanyInfo(e.target.value)}
                                        className="flex-grow p-4 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-700 focus:ring-2 focus:ring-indigo-500 outline-none resize-none"
                                        placeholder="Paste company values, mission statement, or recent news..."
                                    />
                                </div>
                                <div className="h-[48%] flex flex-col">
                                    <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider mb-2">My Resume Context</h3>
                                    <textarea 
                                        value={myResumeText} 
                                        onChange={e => setMyResumeText(e.target.value)}
                                        className="flex-grow p-4 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-700 focus:ring-2 focus:ring-indigo-500 outline-none resize-none"
                                        placeholder="Paste your resume text here to help the AI compare..."
                                    />
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab === 'chat' && (
                        <div className="h-full flex flex-col">
                            <div className="flex-grow p-6 overflow-y-auto space-y-4 bg-slate-50">
                                {messages.length === 0 && (
                                    <div className="text-center text-slate-400 mt-20">
                                        <p>Ask me anything about this job based on your sources.</p>
                                        <div className="flex justify-center gap-2 mt-4">
                                            <button onClick={() => { setInput("What are the top 3 requirements?"); }} className="px-3 py-1.5 bg-white border border-slate-200 rounded-full text-xs hover:border-indigo-300 transition-colors">Top requirements?</button>
                                            <button onClick={() => { setInput("Quiz me on the company values"); }} className="px-3 py-1.5 bg-white border border-slate-200 rounded-full text-xs hover:border-indigo-300 transition-colors">Quiz me</button>
                                        </div>
                                    </div>
                                )}
                                {messages.map((msg, i) => (
                                    <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                                        <div className={`max-w-[80%] px-4 py-3 rounded-2xl text-sm ${msg.role === 'user' ? 'bg-indigo-600 text-white rounded-br-none' : 'bg-white border border-slate-200 text-slate-800 rounded-bl-none'}`}>
                                            {msg.text}
                                        </div>
                                    </div>
                                ))}
                                {isThinking && (
                                    <div className="flex justify-start">
                                        <div className="bg-white border border-slate-200 px-4 py-3 rounded-2xl rounded-bl-none">
                                            <div className="flex gap-1">
                                                <span className="w-2 h-2 bg-slate-300 rounded-full animate-bounce" />
                                                <span className="w-2 h-2 bg-slate-300 rounded-full animate-bounce delay-100" />
                                                <span className="w-2 h-2 bg-slate-300 rounded-full animate-bounce delay-200" />
                                            </div>
                                        </div>
                                    </div>
                                )}
                                <div ref={chatEndRef} />
                            </div>
                            <form onSubmit={handleSendMessage} className="p-4 bg-white border-t border-slate-200 flex gap-2">
                                <input 
                                    type="text" 
                                    value={input} 
                                    onChange={e => setInput(e.target.value)}
                                    placeholder="Ask a question..." 
                                    className="flex-grow px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
                                    disabled={isThinking}
                                />
                                <button type="submit" disabled={isThinking || !input.trim()} className="px-6 py-3 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 disabled:opacity-70 transition-colors flex items-center justify-center min-w-[80px]">
                                    {isThinking ? (
                                        <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                    ) : 'Send'}
                                </button>
                            </form>
                        </div>
                    )}

                    {activeTab === 'audio' && (
                        <div className="h-full flex flex-col items-center justify-center bg-slate-900 text-white relative overflow-hidden">
                            <div className="absolute inset-0 bg-gradient-to-br from-indigo-900/50 to-purple-900/50 pointer-events-none" />
                            
                            <div className="relative z-10 text-center space-y-8">
                                <div className="w-32 h-32 mx-auto bg-gradient-to-tr from-indigo-500 to-purple-500 rounded-full flex items-center justify-center shadow-2xl shadow-indigo-500/30">
                                    {audioState === 'generating' ? (
                                        <div className="w-12 h-12 border-4 border-white/30 border-t-white rounded-full animate-spin" />
                                    ) : (
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-14 w-14 text-white" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.707.707L4.586 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.586l3.707-3.707a1 1 0 011.09-.217zM14.657 2.929a1 1 0 011.414 0A9.972 9.972 0 0119 10a9.972 9.972 0 01-2.929 7.071 1 1 0 01-1.414-1.414A7.971 7.971 0 0017 10c0-2.21-.894-4.208-2.343-5.657a1 1 0 010-1.414zm-2.829 2.828a1 1 0 011.415 0A5.983 5.983 0 0115 10a5.984 5.984 0 01-1.757 4.243 1 1 0 01-1.415-1.415A3.984 3.984 0 0013 10a3.983 3.983 0 00-1.172-2.828 1 1 0 010-1.414z" clipRule="evenodd" /></svg>
                                    )}
                                </div>
                                
                                <div>
                                    <h3 className="text-2xl font-bold">Audio Brief</h3>
                                    <p className="text-indigo-200 mt-2">AI-generated deep dive podcast about this role.</p>
                                </div>

                                {audioState === 'idle' && (
                                    <button 
                                        onClick={handleGenerateAudio}
                                        className="px-8 py-3 bg-white text-indigo-900 font-bold rounded-full hover:bg-indigo-50 transition-all transform hover:scale-105"
                                    >
                                        <span className="flex items-center gap-2">
                                            <SparkleIcon className="w-4 h-4 text-indigo-600" />
                                            Generate Brief
                                        </span>
                                    </button>
                                )}

                                {(audioState === 'paused' || audioState === 'playing') && (
                                    <div className="flex flex-col items-center gap-6">
                                        <Visualizer isPlaying={audioState === 'playing'} />
                                        <button 
                                            onClick={audioState === 'playing' ? pauseAudio : playAudio}
                                            className="px-8 py-3 bg-white text-indigo-900 font-bold rounded-full hover:bg-indigo-50 transition-all transform hover:scale-105 flex items-center gap-3"
                                        >
                                            {audioState === 'playing' ? (
                                                <>
                                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zM7 8a1 1 0 012 0v4a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v4a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" /></svg>
                                                    Pause
                                                </>
                                            ) : (
                                                <>
                                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" /></svg>
                                                    Play Brief
                                                </>
                                            )}
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                </div>
            </motion.div>
        </div>
    );
};

export default JobNotebook;
