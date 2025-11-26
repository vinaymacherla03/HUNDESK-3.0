
import React, { useState, useCallback, useEffect } from 'react';
import { ResumeData } from './types';
import { enhanceResume } from './services/geminiService';
import { sampleResumeData } from './components/sampleData';
import ResumeInput from './components/ResumeInput';
import LoadingSpinner from './components/LoadingSpinner';
import ErrorDisplay from './components/ErrorDisplay';
import ResumeBuilder from './components/ResumeBuilder';
import AuthModal from './components/AuthModal';
import { motion, AnimatePresence } from 'framer-motion';
import { auth, onAuthStateChanged, signOut } from './services/firebase';
import type { User } from 'firebase/auth';
import Navbar from './components/Navbar'; // New: Import Navbar
import LandingPage from './components/LandingPage'; // New: Import LandingPage

type AppState = 'input' | 'loading' | 'editing' | 'error';

const DRAFT_STORAGE_KEY = 'aiResumeBuilderDraft';

const App: React.FC = () => {
  const [appState, setAppState] = useState<AppState>('input');
  const [resumeData, setResumeData] = useState<ResumeData | null>(null);
  const [draftToLoad, setDraftToLoad] = useState<any | null>(null);
  const [jobDescription, setJobDescription] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const [draftExists, setDraftExists] = useState<boolean>(false);
  const [showLandingPage, setShowLandingPage] = useState<boolean>(true); // New: State to control landing page visibility

  // Auth State (still keep for potential future features or user management)
  const [user, setUser] = useState<User | null>(null);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authView, setAuthView] = useState<'login' | 'signup'>('login');

  useEffect(() => {
    if (auth) {
      const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
        setUser(currentUser);
      });
      return () => unsubscribe();
    }
  }, []);

  const handleLogout = async () => {
    if (auth) {
      await signOut(auth);
    }
  };

  const openAuth = (view: 'login' | 'signup') => {
    setAuthView(view);
    setIsAuthModalOpen(true);
  };

  const checkDraft = useCallback(() => {
    const savedDraft = localStorage.getItem(DRAFT_STORAGE_KEY);
    if (savedDraft) {
      setDraftExists(true);
      try {
        setDraftToLoad(JSON.parse(savedDraft));
      } catch (e) {
        console.error("Failed to parse draft", e);
        setDraftExists(false);
      }
    }
  }, []);

  useEffect(() => {
    checkDraft();
  }, [checkDraft]);

  const handleGetStarted = () => {
    setShowLandingPage(false);
    setAppState('input'); // Transition to resume input
  };

  const handleEnhance = async (text: string, jobDesc: string, jobTitle: string) => {
    setAppState('loading');
    setJobDescription(jobDesc);
    try {
      const enhancedData = await enhanceResume(text, jobDesc, jobTitle);
      setResumeData(enhancedData);
      setAppState('editing');
    } catch (err) {
      console.error(err);
      setError("Failed to enhance resume. Please try again.");
      setAppState('error');
    }
  };

  const handleLoadDraft = () => {
    if (draftToLoad && draftToLoad.resumeData) {
      setResumeData(draftToLoad.resumeData);
      setJobDescription(draftToLoad.jobDescription || '');
      setShowLandingPage(false); // Hide landing page
      setAppState('editing');
    }
  };

  const handleStartOver = () => {
    if (window.confirm("Are you sure? This will clear your current session.")) {
      setResumeData(null);
      setJobDescription('');
      localStorage.removeItem(DRAFT_STORAGE_KEY); // Clear saved draft
      setDraftExists(false);
      setDraftToLoad(null);
      setShowLandingPage(true); // Go back to landing page
      setAppState('input'); // Reset app state
    }
  };

  const handleTryDemo = () => {
    setResumeData(sampleResumeData);
    setShowLandingPage(false); // Hide landing page
    setAppState('editing');
  };

  const renderContent = () => {
    if (showLandingPage) {
      return (
        <motion.div key="landing" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="w-full min-h-screen">
          <LandingPage onGetStarted={handleGetStarted} draftExists={draftExists} onLoadDraft={handleLoadDraft} />
        </motion.div>
      );
    }

    switch (appState) {
      case 'loading':
        return <LoadingSpinner />;
      case 'error':
        return <ErrorDisplay message={error || "Something went wrong"} onRetry={() => setAppState('input')} onStartOver={handleStartOver} />;
      case 'editing':
        if (!resumeData) return null;
        return (
          <ResumeBuilder
            initialData={resumeData}
            initialDraft={draftToLoad}
            onStartOver={handleStartOver}
            initialJobDescription={jobDescription}
          />
        );
      case 'input':
      default:
        return (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="w-full min-h-screen bg-[#F8FAFC] flex-1 flex flex-col"
          >
            <ResumeInput
              onEnhance={handleEnhance}
              onTryDemo={handleTryDemo}
              draftExists={draftExists}
              onLoadDraft={handleLoadDraft}
            />
          </motion.div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] font-sans text-slate-900 selection:bg-violet-100 selection:text-violet-900">
      <Navbar
        user={user}
        onLogout={handleLogout}
        onLogin={() => openAuth('login')}
        onSignup={() => openAuth('signup')}
        onGetStarted={handleGetStarted}
        showDashboardButton={!showLandingPage} // Show "Dashboard" button if not on landing page
        onGoToDashboard={() => { setShowLandingPage(false); setAppState('editing'); }} // Go directly to editor if "Dashboard" clicked
        onGoToHome={() => { setShowLandingPage(true); setAppState('input'); }} // Go back to landing page
      />
      <AnimatePresence mode="wait">
        {renderContent()}
      </AnimatePresence>

      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        initialView={authView}
      />
    </div>
  );
};

export default App;
