import React from 'react';
import { motion } from 'framer-motion';
import AgentIcon from '../icons/AgentIcon';

interface AiAgentBubbleProps {
    onClick: () => void;
}

const AiAgentBubble: React.FC<AiAgentBubbleProps> = ({ onClick }) => {
    return (
        <motion.button
            onClick={onClick}
            className="absolute bottom-6 right-6 w-14 h-14 rounded-full bg-gradient-to-br from-primary-600 to-amber-500 text-white shadow-2xl shadow-primary-500/30 flex items-center justify-center z-40"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: 'spring', stiffness: 260, damping: 20, delay: 0.5 }}
            aria-label="Open AI Career Coach"
        >
            <motion.div
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
            >
                <AgentIcon className="w-8 h-8" />
            </motion.div>
        </motion.button>
    );
};

export default AiAgentBubble;