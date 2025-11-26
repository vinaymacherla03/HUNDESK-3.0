
import React from 'react';
import { motion } from 'framer-motion';
import type { User } from 'firebase/auth';

interface NavbarProps {
  user: User | null;
  onLogout: () => void;
  onLogin: () => void;
  onSignup: () => void;
  onGetStarted: () => void; // For "Get Started" on landing page
  showDashboardButton: boolean; // To show "Dashboard" when in editor
  onGoToDashboard: () => void; // To navigate to editor if user is on landing page and clicks 'Dashboard'
  onGoToHome: () => void; // To navigate back to landing page from editor
}

const Navbar: React.FC<NavbarProps> = ({ user, onLogout, onLogin, onSignup, onGetStarted, showDashboardButton, onGoToDashboard, onGoToHome }) => {
  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ type: 'spring', stiffness: 100, damping: 20, delay: 0.1 }}
      className="fixed top-0 left-0 right-0 z-50 bg-[#f2f1ed]/80 backdrop-blur-md shadow-sm border-b border-slate-200/50"
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between h-16">
        {/* Logo */}
        <div className="flex-shrink-0">
          <a href="#" onClick={onGoToHome} className="flex items-center gap-2 text-2xl font-bold text-slate-900 tracking-tight">
            <motion.div
              className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-600 to-violet-600 flex items-center justify-center text-white text-lg font-bold shadow-md"
              whileHover={{ rotate: 15, scale: 1.1 }}
            >
              HD
            </motion.div>
            HuntDesk
          </a>
        </div>

        {/* Navigation Links (Visible on landing page) */}
        <div className="hidden md:flex items-center space-x-6">
          <a href="#features" className="text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors">Features</a>
          <a href="#pricing" className="text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors">Pricing</a>
          <a href="#testimonials" className="text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors">Testimonials</a>
          <a href="#faq" className="text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors">FAQ</a>
        </div>

        {/* Auth Buttons or User Info */}
        <div className="flex items-center gap-3">
          {user ? (
            <div className="relative group">
              <button className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-slate-700 bg-white rounded-full hover:bg-slate-50 border border-slate-200 transition-colors">
                <img src={user.photoURL || `https://ui-avatars.com/api/?name=${user.displayName || user.email}&background=random&size=32`} alt="User Avatar" className="w-6 h-6 rounded-full" />
                {user.displayName || user.email?.split('@')[0]}
              </motion.button>
              <div className="absolute right-0 mt-2 w-48 bg-white border border-slate-200 rounded-lg shadow-lg py-1 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 origin-top-right">
                <button onClick={onLogout} className="block w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-slate-100">Sign Out</button>
              </div>
            </div>
          ) : (
            <>
              {!showDashboardButton && ( // Only show on landing page
                <>
                  <motion.button
                    onClick={onLogin}
                    className="px-4 py-2 text-sm font-medium text-slate-700 hover:text-slate-900 transition-colors"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    Sign In
                  </motion.button>
                  <motion.button
                    onClick={onSignup}
                    className="px-4 py-2 text-sm font-bold text-white bg-slate-900 rounded-full hover:bg-slate-800 transition-colors shadow-md"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    Sign Up
                  </motion.button>
                </>
              )}
            </>
          )}

          {showDashboardButton && (
            <motion.button
              onClick={onGoToDashboard}
              className="px-4 py-2 text-sm font-bold text-white bg-blue-600 rounded-full hover:bg-blue-700 transition-colors shadow-md"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Dashboard
            </motion.button>
          )}
        </div>
      </div>
    </motion.nav>
  );
};

export default Navbar;
